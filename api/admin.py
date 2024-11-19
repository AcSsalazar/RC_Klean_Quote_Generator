from django.contrib import admin
from .models import BusinessType, AreaType, EquipmentType, Invoice, Area, Equipment, AdditionalService, FloorType, Floor, ExtraOptions




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
admin.site.register(Floor)
admin.site.register(ExtraOptions)

