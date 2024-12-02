from .models import QuantityOption
def calculate_price(invoice):
    total_price = 0

    # Area-based pricing using AreaType's base prices
    for area in invoice.areas.all():
        area_type = area.name
        if area_type and area.square_feet:
            if area.square_feet <= 500:
                total_price +=  area_type.price_0_to_500ft or 0
            elif area.square_feet <= 1000:
                total_price += area_type.price_500_to_1000ft or 0
            else:
                total_price += area_type.price_over_to_1000ft or 0

# Equipment-based pricing with QuantityOptions
        for equipment in invoice.equipment.all():
         
         equipment_type = equipment.name

        if equipment_type and equipment.option_type and equipment.option_value:
        # Obtener la opción específica basada en option_type y option_value
            selected_option = QuantityOption.objects.filter(
            equipment_type=equipment_type,
            option_type=equipment.option_type,
            option_value=equipment.option_value).first()

        if selected_option:
            total_price += selected_option.price * equipment.quantity
        else:
            # Si no se encuentra la opción, usar un precio base o manejar el error
            total_price += equipment.quantity * (equipment_type.base_price_unity or 0)
    else:
        # Para equipos sin opciones específicas, usar precio base
        total_price += equipment.quantity * (equipment_type.base_price_unity or 0)

    # Floor type pricing
    for area in invoice.areas.all():
        if area.floor_type:
            total_price += area.floor_type.price or 0

    # Additional services pricing
    for service in invoice.additional_services.all():
        total_price += service.price

    return total_price

