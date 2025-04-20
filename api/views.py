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
from userauths.models import User
from rest_framework.permissions import IsAuthenticated


class InvoiceCalculateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        business_type = request.data.get("business_type")
        areas_data = request.data.get("areas", [])
        equipment_data = request.data.get("equipment", [])
        full_name = request.data.get("full_name")
        email = request.data.get("email")
        city = request.data.get("city")
        zip_code = request.data.get("zip_code")
        phone = request.data.get("phone")
        address = request.data.get("address")

        if not business_type:
            return Response({"error": "Business type is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            business_type_instance = BusinessType.objects.get(pk=business_type)
        except BusinessType.DoesNotExist:
            return Response({"error": "Business type does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user if request.user.is_authenticated else None
        if not user:
            user, _ = User.objects.get_or_create(username="anonymous", defaults={"username": "anonymous", "email": "emptyfield@example.com", "full_name": "Anonymous User"})

        invoice = Invoice.objects.create(
            business_type=business_type_instance,
            user=user,
            total_price=0,
            full_name=full_name,
            email=email,
            city=city,
            zip_code=zip_code,
            phone = phone,
            address = address,
        )

        for area in areas_data:
            Area.objects.create(invoice=invoice, name_id=area['name'], square_feet=area['square_feet'], floor_type_id=area.get('floor_type'))
        for equip in equipment_data:
            Equipment.objects.create(invoice=invoice, name_id=equip['name'], quantity=equip['quantity'], option_type=equip.get('option_type'), option_value=equip.get('option_value'))

        total_price = calculate_price(invoice)
        invoice.total_price = total_price
        invoice.save()

        return Response({"total_price": total_price, "id": invoice.id, "quote_id": invoice.quote_id}, status=status.HTTP_200_OK)

    def patch(self, request, identifier):
        try:
            invoice = Invoice.objects.get(quote_id=identifier)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)

        areas_data = request.data.get("areas", [])
        equipment_data = request.data.get("equipment", [])

        # Clear existing areas/equipment if needed, or append
        Area.objects.filter(invoice=invoice).delete()
        Equipment.objects.filter(invoice=invoice).delete()

        for area in areas_data:
            Area.objects.create(invoice=invoice, name_id=area['name'], square_feet=area['square_feet'], floor_type_id=area.get('floor_type'))
        for equip in equipment_data:
            Equipment.objects.create(invoice=invoice, name_id=equip['name'], quantity=equip['quantity'], option_type=equip.get('option_type'), option_value=equip.get('option_value'))

        total_price = calculate_price(invoice)
        invoice.total_price = total_price
        invoice.save()

        return Response({"total_price": total_price, "id": invoice.id, "quote_id": invoice.quote_id}, status=status.HTTP_200_OK)
    

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
    
class InvoiceDetailView(APIView):
    def get(self, request, identifier):
        try:
            if len(identifier) == 5 and identifier[:3].isalpha() and identifier[3:].isdigit():
                invoice = Invoice.objects.get(quote_id=identifier)
            else:
                invoice = Invoice.objects.get(pk=identifier)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = InvoiceSerializer(invoice)  # Define this serializer
        return Response(serializer.data, status=status.HTTP_200_OK)

    
class SavedQuotesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        invoices = Invoice.objects.filter(user=request.user).order_by('-id')[:20]  # Latest 20
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    