from django.contrib import admin
from .forms import QuantityOptionsForm
from .models import BusinessType, AreaType, EquipmentType, Invoice, Area, Equipment, AdditionalService, FloorType, QuantityOption




class InvoiceAdmin(admin.ModelAdmin):
    search_fields  = ['business_type']
    list_display = ['id', 'business_type', 
                    #'area_type', # 'equipment_type', 
                   'total_price']


# Registra los nuevos modelos en el admin
admin.site.register(BusinessType)
admin.site.register(AreaType)
admin.site.register(EquipmentType)
admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(Area)
admin.site.register(Equipment)
admin.site.register(AdditionalService)
admin.site.register(FloorType)





@admin.register(QuantityOption)
class QuantityOptionsAdmin(admin.ModelAdmin):
    form = QuantityOptionsForm
    list_display = ('equipment_type', 'option_type', 'price', 'option_value')
    list_filter = ('option_type', 'equipment_type')
    search_fields = ('equipment_type__name',)