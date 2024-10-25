from rest_framework import serializers
from .models import Invoice, Area, Equipment, BusinessType, AreaType, EquipmentType, AdditionalService

class BusinessTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessType
        fields = ['id', 'name']

class AreaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaType
        fields = ['id', 'name']

class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = ['id', 'name']

# Serializador para las áreas (Area)
class AreaSerializer(serializers.ModelSerializer):
    name = AreaTypeSerializer()  # id, name del tipo de area

    class Meta:
        model = Area
        fields = ['name', 'square_feet']

# Serializador para el equipo (Equipment)
class EquipmentSerializer(serializers.ModelSerializer):
    name = EquipmentTypeSerializer()  # ID del tipo de equipo

    class Meta:
        model = Equipment
        fields = ['name', 'quantity']

# Serializador para los servicios adicionales
class AdditionalServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalService
        fields = ['name', 'price']  # Nombre del servicio y su precio

# Serializador para la factura (Invoice)
class InvoiceSerializer(serializers.ModelSerializer):
    areas = AreaSerializer(many=True)
    equipment = EquipmentSerializer(many=True)
    additional_services = AdditionalServiceSerializer(many=True, required=False)
    business_type = BusinessTypeSerializer()  # ID del tipo de negocio

    class Meta:
        model = Invoice
        fields = ['id', 'business_type', 'areas', 'equipment', 'additional_services', 'total_price']

    # Este método crea una factura junto con las áreas, equipos y servicios adicionales.
    def create(self, validated_data):
        areas_data = validated_data.pop('areas')
        equipment_data = validated_data.pop('equipment')
        additional_services_data = validated_data.pop('additional_services', [])
        
        # Crear la factura (invoice)
        invoice = Invoice.objects.create(**validated_data)

        # Añadir las áreas
        for area_data in areas_data:
            Area.objects.create(invoice=invoice, **area_data)

        # Añadir los equipos
        for equip_data in equipment_data:
            Equipment.objects.create(invoice=invoice, **equip_data)

        # Añadir los servicios adicionales
        for service_data in additional_services_data:
            AdditionalService.objects.create(invoice=invoice, **service_data)

        return invoice
