from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
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
    

from django.core.exceptions import ValidationError

from django.db import models
from django.core.exceptions import ValidationError

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









 # Modelo para Invoice
class Invoice(models.Model):
    business_type = models.ForeignKey(BusinessType, on_delete=models.SET_NULL, null=True)
    #area_type =  models.ManyToManyField(AreaType,  null=True)
    #equipment_type = models.ManyToManyField(EquipmentType,  null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    



    
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




# Modelo para Additional Services
class AdditionalService(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='additional_services', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
    

