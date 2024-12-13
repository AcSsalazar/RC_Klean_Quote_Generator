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


    # Equipment pricing logic
    for equipment in invoice.equipment.all():
        equipment_type = equipment.name

        # Handle equipment with extra options
        if equipment_type and equipment.option_type and equipment.option_value:
            selected_option = QuantityOption.objects.filter(
                equipment_type=equipment_type,
                option_type=equipment.option_type,
                option_value=equipment.option_value
            ).first()

            if selected_option:
                total_price += selected_option.price * equipment.quantity
            else:
                print(
                    f"Warning: No matching option for equipment {equipment_type.name} "
                    f"with option_type={equipment.option_type} and option_value={equipment.option_value}"
                )
                # Use base price if no matching option is found
                total_price += equipment.quantity * (equipment_type.base_price_unity or 0)
        else:
            # Handle equipment without extra options
            total_price += equipment.quantity * (equipment_type.base_price_unity or 0)



    return total_price

