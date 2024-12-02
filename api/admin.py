from django.contrib import admin

from .models import BusinessType, AreaType, EquipmentType, Invoice, Area, Equipment, AdditionalService, FloorType, QuantityOption



# Los inlines permiten agregar, editar y eliminar instancias de modelos relacionados dentro de un formulario de administración: 

class AreaInline(admin.TabularInline):
    model = Area
    extra = 0

class EquipmentInline(admin.TabularInline):
    model = Equipment
    extra = 0

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'business_type', 'total_price', 'get_areas', 'get_equipment']
    inlines = [AreaInline, EquipmentInline]

    def get_areas(self, obj):
        return ", ".join([str(area.name) for area in obj.areas.all()])
    get_areas.short_description = 'Áreas'

    def get_equipment(self, obj):
        equipment_list = []
        for equipment in obj.equipment.all():
            name = str(equipment.name)
            if equipment.option_type and equipment.option_value:
                option = f"{equipment.option_type}: {equipment.option_value}"
                equipment_list.append(f"{name} ({option})")
            else:
                equipment_list.append(name)
        return ", ".join(equipment_list)
    get_equipment.short_description = 'Equipos'


# Registra los nuevos modelos en el admin
admin.site.register(BusinessType)
admin.site.register(AreaType)
admin.site.register(EquipmentType)
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
