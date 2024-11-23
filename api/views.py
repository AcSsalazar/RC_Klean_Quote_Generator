from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice, Area, Equipment, AdditionalService, BusinessType, AreaType, EquipmentType, FloorType, QuantityOption
from .helpers import calculate_price
from .serializers import BusinessTypeSerializer, AreaTypeSerializer, FloorTypeSerializer, EquipmentTypeSerializer, InvoiceSerializer, QuantityOptionSerializer

class InvoiceCalculateView(APIView):
    def post(self, request):
        # Recibir datos de la solicitud (request)
        business_type = request.data.get("business_type")
        areas_data = request.data.get("areas", [])
        equipment_data = request.data.get("equipment", [])
        additional_services_data = request.data.get("additional_services", [])

        # Verificar que los datos requeridos estén presentes
        if not business_type or not areas_data or not equipment_data:
            return Response({"error": "Faltan datos necesarios."}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la instancia de la factura (invoice)
        try:
            invoice = Invoice.objects.create(business_type_id=business_type, total_price=0)
        except BusinessType.DoesNotExist:
            return Response({"error": "El tipo de negocio no existe."}, status=status.HTTP_400_BAD_REQUEST)

        # Añadir áreas a la factura
        for area in areas_data:
            try:
                Area.objects.create(
                    invoice=invoice,
                    name_id=area['name'],  # Se espera que 'name' sea el ID del tipo de área
                    square_feet=area['square_feet']
                )
            except Exception as e:
                return Response({"error": f"Error al añadir el área: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Añadir equipos a la factura
        for equip in equipment_data:
            try:
                Equipment.objects.create(
                    invoice=invoice,
                    name_id=equip['name'],  # Se espera que 'name' sea el ID del tipo de equipo
                    quantity=equip['quantity']
                )
            except Exception as e:
                return Response({"error": f"Error al añadir el equipo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Añadir servicios adicionales a la factura
        for service in additional_services_data:
            try:
                AdditionalService.objects.create(
                    invoice=invoice,
                    name=service['name'],  # Se espera que 'name' sea una cadena (nombre del servicio)
                    price=service['price']  # Precio fijo por el servicio adicional
                )
            except Exception as e:
                return Response({"error": f"Error al añadir el servicio adicional: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Calcular el precio total
        try:
            total_price = calculate_price(invoice)
            invoice.total_price = total_price
            invoice.save()
        except Exception as e:
            return Response({"error": f"Error al calcular el precio total: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Devolver el precio total en la respuesta
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