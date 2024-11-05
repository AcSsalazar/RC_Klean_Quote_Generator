from django.db import models

# Modelo para BusinessType
class BusinessType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

 # Modelo para Invoice
class Invoice(models.Model):
    business_type = models.ForeignKey(BusinessType, on_delete=models.SET_NULL, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)   

# Modelo para EquipmentType
class EquipmentType(models.Model):
    name = models.CharField(max_length=100)
    base_price_unity = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True)  # Base price for equipment type
    additional_pricing_info = models.CharField(max_length= 150, null=True, blank=True)  # To store complex pricing rules (if needed)

    def __str__(self):
        return self.name


    
# Modelo para AreaType

class AreaType(models.Model):
    name = models.CharField(max_length=100)
    price_0_to_500ft = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    price_500_to_1000ft = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    price_over_to_1000ft = models.DecimalField(max_digits=5, decimal_places=2, null=True)

    def __str__(self):
        return self.name
    

class FloorType(models.Model):
    name = models.CharField(max_length=100, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True)


    def __str__(self):
        return self.name
      


# Modelo para Area

# Modelo para los precios base
class Floor(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='floor_type', on_delete=models.CASCADE, null=True)
    name = models.ForeignKey(FloorType, on_delete=models.SET_NULL,  null=True )
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
       return self.name
    

class Area(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='areas', on_delete=models.CASCADE)
    name = models.ForeignKey(AreaType, on_delete=models.SET_NULL, null=True)
    square_feet = models.IntegerField()
    floor_type = models.ForeignKey(FloorType, related_name='floor_type', on_delete=models.CASCADE, null=True)

# Modelo para Equipment
class Equipment(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='equipment', on_delete=models.CASCADE)
    name = models.ForeignKey(EquipmentType, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=1)

# Modelo para Additional Services
class AdditionalService(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='additional_services', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
    

