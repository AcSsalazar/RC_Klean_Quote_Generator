from django.contrib import admin

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






from .forms import QuantityOptionForm

@admin.register(QuantityOption)
class QuantityOptionAdmin(admin.ModelAdmin):
    form = QuantityOptionForm
    list_display = ('equipment_type', 'option_type_display', 'option_value_display', 'price')

    def option_type_display(self, obj):
        return obj.get_option_type_display()

    def option_value_display(self, obj):
        return obj.get_option_value_display()
