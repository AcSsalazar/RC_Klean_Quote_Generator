from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice, Area, Equipment, BusinessType, AreaType, EquipmentType, FloorType, QuantityOption
from .helpers import calculate_price
from .serializers import BusinessTypeSerializer, AreaTypeSerializer, FloorTypeSerializer, EquipmentTypeSerializer, InvoiceSerializer, QuantityOptionSerializer
from django.http import HttpResponse
from django.http import HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from userauths.models import User
from rest_framework.permissions import IsAuthenticated
class InvoiceCalculateView(APIView):

    permission_classes = [ AllowAny ] # Allow both authenticated and unauthenticated users
    authentication_classes = [JWTAuthentication] # Use JWT for authenticated users

    def post(self, request):
        business_type = request.data.get("business_type")
        areas_data = request.data.get("areas", [])
        equipment_data = request.data.get("equipment", [])

        


        # Validaciones iniciales
        if not business_type:
            return Response({"error": "Bussiness type is required."}, status=status.HTTP_400_BAD_REQUEST)
        

        # Validar si el tipo de negocio existe
        try:
            business_type_instance = BusinessType.objects.get(pk=business_type)
        except BusinessType.DoesNotExist:
            return Response({"error": "Business type does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        # User management

        user = request.user if request.user.is_authenticated else None
        if not user:
            user, _ = User.objects.get_or_create(username="Anonymous")
            email="emptyfield@example.com",
            defaults = {"username": "anonymous", "full_name": "Anonymous User"}
        # Crear la factura
        invoice = Invoice.objects.create(business_type=business_type_instance, user=user, total_price=0)

        # Procesar áreas
        for area in areas_data:
            
                Area.objects.create(
                    invoice=invoice,
                    name_id=area['name'],
                    square_feet=area['square_feet'],
                    floor_type_id=area.get('floor_type')
                )
#            except Exception as e:
#               invoice.delete()
#                return Response({"error": f"Error al añadir el área: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Procesar equipos
        for equip in equipment_data:
#            try:
                Equipment.objects.create(
                    invoice=invoice,
                    name_id=equip['name'],
                    quantity=equip['quantity'],
                    option_type=equip.get('option_type'),  # Agregar esta línea
                    option_value=equip.get('option_value'),  # Agregar esta línea
                )
#            except Exception as e:
#                invoice.delete()
#                print(f"Error al añadir el equipo: {str(e)}")  # Agregar esta línea para imprimir el error
#                return Response({"error": f"Error al añadir el equipo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


        # Calcular precio total
#        try:
        total_price = calculate_price(invoice)
        invoice.total_price = total_price
        invoice.save()
#        except Exception as e:
#            invoice.delete()
#            return Response({"error": f"Error al calcular el precio total: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

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
    

class InvoicePDFView(APIView):
    def get(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found."}, status=404)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{pk}.pdf"'

        p = canvas.Canvas(response, pagesize=letter)
        p.setFont("Helvetica", 12)
        y = 750

        p.drawString(100, y, f"Invoice ID: {invoice.id}")
        y -= 20
        p.drawString(100, y, f"Business Type: {invoice.business_type.name}")
        y -= 20
        p.drawString(100, y, f"Total Price: ${invoice.total_price}")
        y -= 30

        p.drawString(100, y, "Areas:")
        y -= 20
        for area in invoice.areas.all():
            p.drawString(100, y, f"{area.name.name} - {area.square_feet} sq ft")
            y -= 20

        y -= 10
        p.drawString(100, y, "Equipment:")
        y -= 20
        for equip in invoice.equipment.all():
            p.drawString(100, y, f"{equip.name.name} - Quantity: {equip.quantity}")
            y -= 20

        p.showPage()
        p.save()
        return response
    
class SavedQuotesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        invoices = Invoice.objects.filter(user=request.user).order_by('-id')[:20]  # Latest 20
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    