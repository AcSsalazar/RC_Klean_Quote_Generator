from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice, Area, Equipment, AdditionalService, BusinessType, AreaType, EquipmentType, FloorType, QuantityOption
from .helpers import calculate_price
from .serializers import BusinessTypeSerializer, AreaTypeSerializer, FloorTypeSerializer, EquipmentTypeSerializer, InvoiceSerializer, QuantityOptionSerializer

class InvoiceCalculateView(APIView):
    def post(self, request):
        business_type = request.data.get("business_type")
        areas_data = request.data.get("areas", [])
        equipment_data = request.data.get("equipment", [])


        # Validaciones iniciales
        if not business_type or not areas_data or not equipment_data:
            return Response({"error": "Faltan datos necesarios."}, status=status.HTTP_400_BAD_REQUEST)

        # Validar si el tipo de negocio existe
        try:
            business_type_instance = BusinessType.objects.get(pk=business_type)
        except BusinessType.DoesNotExist:
            return Response({"error": "El tipo de negocio no existe."}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la factura
        invoice = Invoice.objects.create(business_type=business_type_instance, total_price=0)

        # Procesar áreas
        for area in areas_data:
            try:
                Area.objects.create(
                    invoice=invoice,
                    name_id=area['name'],
                    square_feet=area['square_feet'],
                    floor_type_id=area.get('floor_type')
                )
            except Exception as e:
                invoice.delete()
                return Response({"error": f"Error al añadir el área: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Procesar equipos
        for equip in equipment_data:
            try:
                Equipment.objects.create(
                    invoice=invoice,
                    name_id=equip['name'],
                    quantity=equip['quantity'],
                    option_type=equip.get('option_type'),  # Agregar esta línea
                    option_value=equip.get('option_value'),  # Agregar esta línea
                )
            except Exception as e:
                invoice.delete()
                print(f"Error al añadir el equipo: {str(e)}")  # Agregar esta línea para imprimir el error
                return Response({"error": f"Error al añadir el equipo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Procesar servicios adicionales
        '''for service in additional_services_data:
            try:
                AdditionalService.objects.create(
                    invoice=invoice,
                    name=service['name'],
                    price=service['price']
                )
            except Exception as e:
                invoice.delete()
                return Response({"error": f"Error al añadir el servicio adicional: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)'''

        # Calcular precio total
        try:
            total_price = calculate_price(invoice)
            invoice.total_price = total_price
            invoice.save()
        except Exception as e:
            invoice.delete()
            return Response({"error": f"Error al calcular el precio total: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"total_price": total_price, "id": invoice.id}, status=status.HTTP_200_OK)



class OptionsView(APIView):
    def get(self, request):
        # Obtener todas las opciones desde los modelos correspondientes
        business_types = BusinessType.objects.all()
        equipment_types = EquipmentType.objects.all()
        area_names = AreaType.objects.all()
        floor_types = FloorType.objects.all()
        bus_qty = QuantityOption.objects.all()

        # Serializar los datos para enviarlos como respuesta en JSON
        data = {
            'business_types': BusinessTypeSerializer(business_types, many=True).data,
            'equipment_types': EquipmentTypeSerializer(equipment_types, many=True).data,
            'area_names': AreaTypeSerializer(area_names, many=True).data,
            'floor_types': FloorTypeSerializer(floor_types, many=True).data,
            'bus_qty': QuantityOptionSerializer(bus_qty, many=True).data,

        }
        return Response(data)
    
# Vista para generar el detalle de la factura
class InvoiceDetailView(APIView):
    def get(self, request, pk):
        try:
            # Obtener la factura por ID (pk)
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({"error": "Factura no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializar los detalles de la factura
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data, status=status.HTTP_200_OK)