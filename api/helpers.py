from decimal import Decimal
from .models import QuantityOption

def calculate_price(invoice):
    total_price = Decimal('0.00')

    # Area-based pricing using AreaType's base prices
    for area in invoice.areas.all():
        area_type = area.name
        if area_type and area.square_feet:
            area_price = Decimal('0.00')
            if area.square_feet <= 500:
                area_price = area_type.price_0_to_500ft or Decimal('0.00')
            elif area.square_feet <= 1000:
                area_price = area_type.price_500_to_1000ft or Decimal('0.00')
            else:
                area_price = area_type.price_over_to_1000ft or Decimal('0.00')
            
            # Apply 50% discount for restaurants
            if invoice.business_type.name.lower() == "restaurants":
                area_price *= Decimal('0.5')
            
            total_price += area_price

    # Equipment pricing logic
    for equipment in invoice.equipment.all():
        equipment_type = equipment.name
        if equipment_type and equipment.option_type and equipment.option_value:
            selected_option = QuantityOption.objects.filter(
                equipment_type=equipment_type,
                option_type=equipment.option_type,
                option_value=equipment.option_value
            ).first()
            if selected_option:
                total_price += Decimal(str(selected_option.price)) * Decimal(str(equipment.quantity))
            else:
                print(
                    f"Warning: No matching option for {equipment_type.name} "
                    f"with option_type={equipment.option_type} and option_value={equipment.option_value}"
                )
                total_price += Decimal(str(equipment_type.base_price_unity or '0.00')) * Decimal(str(equipment.quantity))
        else:
            total_price += Decimal(str(equipment_type.base_price_unity or '0.00')) * Decimal(str(equipment.quantity))

    # Floor type pricing
    for area in invoice.areas.all():
        if area.floor_type:
            total_price += Decimal(str(area.floor_type.price or '0.00'))

    return total_price.quantize(Decimal('0.01'))


