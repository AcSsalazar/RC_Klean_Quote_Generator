def calculate_price(invoice):

    total_price = 0

    # Area-based pricing
    for area in invoice.areas.all():
        if area.name.name == "Kitchen":
            if area.square_feet <= 500:
                total_price += area.square_feet * 1.50
            elif area.square_feet <= 1000:
                total_price += area.square_feet * 1.25
            else:
                total_price += area.square_feet * 1.00
        elif area.name.name == "Dining Room" or area.name.name == "Lobby":
            if area.square_feet <= 500:
                total_price += area.square_feet * 1.00
            elif area.square_feet <= 1000:
                total_price += area.square_feet * 0.85
            else:
                total_price += area.square_feet * 0.75
        elif area.name.name == "Bathroom":
            total_price += 75 * area.square_feet  # Precio fijo por baño
        # Se pueden añadir más reglas para otras áreas

    # Equipment-based pricing
    for equipment in invoice.equipment.all():
        # Stoves and Ranges
        if equipment.name.name == "Stove" or equipment.name.name == "Range":
            if equipment.quantity == 2:
                total_price += 50 * equipment.quantity
            elif equipment.quantity == 4:
                total_price += 75 * equipment.quantity
            elif equipment.quantity == 6:
                total_price += 100 * equipment.quantity
            elif equipment.quantity == 8:
                total_price += 125 * equipment.quantity
        # Ovens
        elif equipment.name.name == "Oven":
            total_price += 80 * equipment.quantity
        elif equipment.name.name == "Convection Oven":
            total_price += 100 * equipment.quantity
        elif equipment.name.name == "Combi Steamer":
            total_price += 120 * equipment.quantity
        # Grills and Griddles
        elif equipment.name.name == "Griddle":
            if equipment.size == 24:
                total_price += 70 * equipment.quantity
            elif equipment.size == 30:
                total_price += 85 * equipment.quantity
            elif equipment.size == 48:
                total_price += 100 * equipment.quantity
            else:
                total_price += 100 * equipment.quantity  # Precio a evaluar
        # Fryers
        elif equipment.name.name == "Fryer":
            total_price += 60 * equipment.quantity
        # Hood Vents
        elif equipment.name.name == "Hood Vent":
            if equipment.size == 6:
                total_price += 150 * equipment.quantity
            elif equipment.size == 8:
                total_price += 200 * equipment.quantity
            elif equipment.size == 10:
                total_price += 250 * equipment.quantity
            elif equipment.size == 12:
                total_price += 300 * equipment.quantity
            elif equipment.size >= 15:
                total_price += 350 * equipment.quantity
        # Refrigerators and Walk-Ins
        elif equipment.name.name == "Refrigerator" or equipment.name.name == "Walk-In":
            total_price += 50 * equipment.quantity  # Exterior y juntas
            total_price += 100 * equipment.quantity  # Limpieza interior (si está vacío)
        # Prep Tables and Countertops
        elif equipment.name.name == "Prep Table" or equipment.name.name == "Countertop":
            total_price += 25 * equipment.quantity
        # Sinks
        elif equipment.name.name == "Sink":
            total_price += 30 * equipment.quantity
        # Ice Machines
        elif equipment.name.name == "Ice Machine":
            total_price += 80 * equipment.quantity
        # Other Equipment
        else:
            total_price += 50 * equipment.quantity  # Precio fijo por equipo estándar
        # Añadir más reglas para equipos si es necesario...

    # Additional services pricing
    for service in invoice.additional_services.all():
        if service.name == "Carpet Cleaning":
            total_price += service.square_feet * 0.25
        elif service.name == "Floor Buffing":
            total_price += service.square_feet * 0.50
        elif service.name == "High Dusting":
            total_price += 15 * service.quantity  # Por cada luz, ventilador, etc.

    return total_price
