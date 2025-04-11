from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.mail import send_mail
from django.conf import settings
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

import random
import string
from django.db import models
from django.conf import settings
from django.core.mail import send_mail

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
    # Indicator to prevent re-sending email if it has already been sent once.
    email_sent = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Generate quote_id if it doesn't exist.
        if not self.quote_id:
            self.quote_id = self.generate_quote_id()
        super().save(*args, **kwargs)
        
        # Once saved, check if all information is complete and the email hasn't been sent yet.
        # This validation allows sending the email when the invoice was initially incomplete but later updated.
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
            # Save the change in email_sent without entering an infinite save loop.
            super().save(update_fields=['email_sent'])

    def is_complete(self):
        return all([
            self.full_name,
            self.email,
            self.city,
            self.zip_code,
            self.total_price,
            self.areas.exists(),    # It is assumed that having at least one area is mandatory.
            self.equipment.exists() # It is assumed that having at least one equipment is mandatory.
        ])

    def build_email_context(self):
        html_content = []
        # General Invoice Information
        html_content.append(f"<p><strong>Invoice:</strong> {self.quote_id}</p>")
        html_content.append(f"<p><strong>Name:</strong> {self.full_name}</p>")
        html_content.append(f"<p><strong>Date:</strong> {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>")
        html_content.append(f"<p><strong>Total:</strong> {self.total_price}</p>")
        html_content.append(f"<p><strong>Business Type:</strong> {self.business_type.name if self.business_type else 'N/A'}</p>")
        html_content.append(f"<p><strong>City:</strong> {self.city}</p>")
        html_content.append(f"<p><strong>Zip Code:</strong> {self.zip_code}</p>")
        
        # Area Information
        if self.areas.exists():
            html_content.append("<h3>Areas:</h3>")
            html_content.append("<ul>")
            for area in self.areas.all():
                # Get the area name (AreaType) and its prices if defined.
                area_name = area.name.name if area.name else 'N/A'
                price_0_to_500ft = area.name.price_0_to_500ft if area.name and area.name.price_0_to_500ft is not None else 'N/A'
                price_500_to_1000ft = area.name.price_500_to_1000ft if area.name and area.name.price_500_to_1000ft is not None else 'N/A'
                price_over_1000ft = area.name.price_over_to_1000ft if area.name and area.name.price_over_to_1000ft is not None else 'N/A'
                square_feet = area.square_feet
                # Floor type details, if available.
                floor = f", Floor Type: {area.floor_type.name}, Floor Price: {area.floor_type.price}" if area.floor_type else ""
                area_detail = (
                    f"<li><strong>Area:</strong> {area_name}"
                    f", Square Feet: {square_feet}"
                    f", Price (0 to 500ft): {price_0_to_500ft}"
                    f", Price (500 to 1000ft): {price_500_to_1000ft}"
                    f", Price (over 1000ft): {price_over_1000ft}{floor}</li>"
                )
                html_content.append(area_detail)
            html_content.append("</ul>")
        else:
            html_content.append("<p><strong>Areas:</strong> No associated areas found.</p>")
        
        # Equipment Information
        if self.equipment.exists():
            html_content.append("<h3>Equipment:</h3>")
            html_content.append("<ul>")
            for equip in self.equipment.all():
                equip_type = equip.name.name if equip.name else 'N/A'
                quantity = equip.quantity
                option = equip.option_type if equip.option_type else 'N/A'
                value = equip.option_value if equip.option_value is not None else 'N/A'
                equip_detail = (
                    f"<li><strong>Equipment:</strong> {equip_type}"
                    f", Quantity: {quantity}"
                    f", Option: {option}"
                    f", Value: {value}</li>"
                )
                html_content.append(equip_detail)
            html_content.append("</ul>")
        else:
            html_content.append("<p><strong>Equipment:</strong> No associated equipment found.</p>")
        
        return {
            'html_content': "".join(html_content)
        }
    
    def generate_quote_id(self):
        """Generates a unique ID composed of 3 letters and 2 digits."""
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