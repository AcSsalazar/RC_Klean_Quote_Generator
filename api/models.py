from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
import random
import string

# Modelo para BusinessType
class BusinessType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class AreaType(models.Model):
    name = models.CharField(max_length=100)
    price_0_to_500ft = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    price_500_to_1000ft = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    price_over_to_1000ft = models.DecimalField(max_digits=5, decimal_places=2, null=True)

    def __str__(self):
        return self.name

# Modelo para EquipmentType
class EquipmentType(models.Model):
    name = models.CharField(max_length=100)

    base_price_unity = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True)  # Base price for equipment type
    additional_pricing_info = models.CharField(max_length= 150, null=True, blank=True)  # To store complex pricing rules (if needed)
    
    def __str__(self):
        return self.name
    
class QuantityOption(models.Model):
    BURNER_CHOICES = [
        (4, '4 burners'),
        (6, '6 burners'),
        (8, '8 burners'),
        (10, '10 burners'),
    ]
    GRILL_CHOICES = [
        (24, '24 in'),
        (30, '30 in'),
        (48, '48 in'),
        (60, '60 in'),
    ]
    HOOD_CHOICES = [
        (6, '6 ft'),
        (8, '8 ft'),
        (10, '10 ft'),
        (12, '12 ft'),
        (15, '15 ft'),
    ]

    ALL_CHOICES = BURNER_CHOICES + GRILL_CHOICES + HOOD_CHOICES

    OPTION_TYPES = [
        ('burner', 'Burners'),
        ('grill_size', 'Grill Sizes'),
        ('hood', 'Hood Sizes'),
    ]

    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE, related_name='extra_options')
    option_type = models.CharField(max_length=20, choices=OPTION_TYPES)
    option_value = models.IntegerField(choices=ALL_CHOICES)  # Todas las opciones disponibles
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def clean(self):
        """Valida que el valor de option_value sea válido para el option_type."""
        choices_map = {
            'burner': dict(self.BURNER_CHOICES),
            'grill_size': dict(self.GRILL_CHOICES),
            'hood': dict(self.HOOD_CHOICES),
        }
        valid_choices = choices_map.get(self.option_type, {})
        if self.option_value not in valid_choices:
            raise ValidationError({
                'option_value': f"'{self.option_value}' no es válido para el tipo {self.get_option_type_display()}."
            })

    def get_option_value_display(self):
        """Devuelve el texto legible basado en el option_type."""
        choices_map = {
            'burner': dict(self.BURNER_CHOICES),
            'grill_size': dict(self.GRILL_CHOICES),
            'hood': dict(self.HOOD_CHOICES),
        }
        valid_choices = choices_map.get(self.option_type, {})
        return valid_choices.get(self.option_value, f"{self.option_value} (unrecognized)")

    def __str__(self):
        return f"{self.equipment_type.name} - {self.get_option_type_display()}: {self.get_option_value_display()}"

class Invoice(models.Model):
    business_type = models.ForeignKey('BusinessType', on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey('userauths.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    quote_id = models.CharField(max_length=5, unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=80, null=True, blank=True)
    email = models.EmailField(max_length=80, null=True, blank=True)
    city = models.CharField(max_length=20, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    # Indicador para evitar el reenvío del correo si ya se envió una vez.
    email_sent = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Genera quote_id si no existe.
        if not self.quote_id:
            self.quote_id = self.generate_quote_id()
        super().save(*args, **kwargs)

        # Una vez guardado, si la información está completa y el correo aún no se ha enviado, se envía.
        if self.email and self.is_complete() and not self.email_sent:
            email_context = self.build_email_context()
            send_mail(
                subject='Your invoice has been generated',
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.email],
                html_message=email_context.get("html_content")
            )
            self.email_sent = True
            # Guarda el cambio en email_sent sin entrar en un bucle infinito.
            super().save(update_fields=['email_sent'])

    def is_complete(self):
        return all([
            self.full_name,
            self.email,
            self.city,
            self.zip_code,
            self.total_price,
            self.areas.exists(),    # Debe haber al menos un área.
            self.equipment.exists()   # Debe haber al menos un equipo.
        ])

    def build_email_context(self):
        lower_estimate = self.total_price * Decimal("0.80")
        upper_estimate = self.total_price * Decimal("1.20")
        today_date = timezone.now().strftime("%Y-%m-%d")
        
        html_content = []
        html_content.append("<div style='font-family: Arial, sans-serif; padding: 10px;'>")
        html_content.append("<h2>Summary</h2>")
        html_content.append(
            f"<p class='estimated-title'>The estimated price is between: ${lower_estimate:.2f} and ${upper_estimate:.2f}</p>"
        )
        
        # Detalles de la cotización
        html_content.append("<div class='invoice-header'>")
        html_content.append("<h3>Service Quote Details:</h3>")
        html_content.append(f"<p><strong>Invoice No:</strong> {self.quote_id}</p>")
        full_name = self.full_name if self.full_name else "Anonymous User"
        html_content.append(f"<p><strong>Issued to:</strong> {full_name}</p>")
        html_content.append(f"<p><strong>Due Date:</strong> {today_date}</p>")
        html_content.append("</div>")
        
        # Construcción de la tabla con los ítems
        html_content.append(
            "<table class='invoice-table' border='1' cellspacing='0' cellpadding='5' style='border-collapse: collapse; width: 100%;'>"
        )
        html_content.append("<thead>")
        html_content.append("<tr><th>DESCRIPTION</th><th>QTY</th><th>PRICE</th><th>SUBTOTAL</th></tr>")
        html_content.append("</thead>")
        html_content.append("<tbody>")
        
        # Fila 1: Business Type (tipo de servicio) con precio 0
        business_type_name = self.business_type.name if self.business_type else "Unknown"
        html_content.append(
            f"<tr><td>{business_type_name}</td><td>1</td><td>$0.00</td><td>$0.00</td></tr>"
        )
        
        # Filas: Equipos
        equipment_items = list(self.equipment.all())
        if equipment_items:
            for equip in equipment_items:
                equip_type = equip.name.name if equip.name else "Unknown"
                # Agrega una descripción extra si se cuenta con option_type.
                if equip.option_type:
                    description = f"{equip_type} - {equip.option_type} {equip.option_value}"
                else:
                    description = equip_type
                qty = equip.quantity
                # Se utiliza el precio base definido en EquipmentType.
                equipment_unit_price = (equip.name.base_price_unity 
                                        if equip.name and equip.name.base_price_unity is not None 
                                        else Decimal("0.00"))
                subtotal = equipment_unit_price * qty
                html_content.append(
                    f"<tr><td>{description}</td><td>{qty}</td><td>${equipment_unit_price:.2f}</td><td>${subtotal:.2f}</td></tr>"
                )
        
        # Filas: Áreas
        area_items = list(self.areas.all())
        if area_items:
            for area in area_items:
                area_name = area.name.name if area.name else "Unknown"
                # Se muestra el tamaño del área.
                sq_ft = f"{area.square_feet}" if area.square_feet is not None else "N/A"
                floor_name = area.floor_type.name if area.floor_type else ""
                description = f"{area_name} ({sq_ft} sq ft)"
                if floor_name:
                    description += f" - {floor_name}"
                # Se obtiene el precio base del área según los square feet utilizando los campos de AreaType.
                if area.name:
                    if area.square_feet <= 500:
                        base_price = area.name.price_0_to_500ft or Decimal("0.00")
                    elif area.square_feet <= 1000:
                        base_price = area.name.price_500_to_1000ft or Decimal("0.00")
                    else:
                        base_price = area.name.price_over_to_1000ft or Decimal("0.00")
                else:
                    base_price = Decimal("0.00")
                # Se suma el precio del piso, si existe, definido en FloorType.
                floor_price = (area.floor_type.price 
                               if area.floor_type and area.floor_type.price is not None 
                               else Decimal("0.00"))
                final_area_price = (base_price * 0.5) + floor_price
                html_content.append(
                    f"<tr><td>{description}</td><td>1</td><td>${final_area_price:.2f}</td><td>${final_area_price:.2f}</td></tr>"
                )
        
        html_content.append("</tbody></table>")
        html_content.append("</div>")  # Cierre del contenedor principal

        return {"html_content": "".join(html_content)}

    def generate_quote_id(self):
        """Genera un ID único compuesto de 3 letras y 2 dígitos."""
        while True:
            letters = ''.join(random.choices(string.ascii_uppercase, k=3))
            numbers = ''.join(random.choices(string.digits, k=2))
            quote_id = f"{letters}{numbers}"
            if not Invoice.objects.filter(quote_id=quote_id).exists():
                return quote_id

    def __str__(self):
        username = self.user.username if self.user and hasattr(self.user, 'username') else 'Anonymous'
        return f"Invoice {self.quote_id or self.id} - {username} on {self.created_at.strftime('%Y-%m-%d')}"

# Modelo para AreaType
class FloorType(models.Model):
    name = models.CharField(max_length=100, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True)

    def __str__(self):
        return self.name

# Modelo para Area
class Area(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='areas', on_delete=models.CASCADE)
    name = models.ForeignKey(AreaType, on_delete=models.SET_NULL, null=True)
    square_feet = models.IntegerField()
    floor_type = models.ForeignKey(FloorType, related_name='floor_type', on_delete=models.SET_NULL, null=True)

# Modelo para Equipment
class Equipment(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='equipment', on_delete=models.CASCADE)
    name = models.ForeignKey(EquipmentType, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    option_type = models.CharField(max_length=20, blank=True, null=True)

    option_value = models.IntegerField(
    blank=True,
    null=True,
    validators=[MinValueValidator(0), MaxValueValidator(99)]
)

    def __str__(self):
        return f"{self.quantity} x {self.option_type}"