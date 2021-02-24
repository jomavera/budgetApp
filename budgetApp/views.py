from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User, Tipo, Units, Items, Budget, Product


def index(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "budgetApp/home.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "budgetApp/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "budgetApp/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "budgetApp/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "budgetApp/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "budgetApp/register.html")

def items(request):

    if request.user.is_authenticated:
        return render(request, "budgetApp/items.html")

def budgets(request):

    if request.user.is_authenticated:
        return render(request, "budgetApp/budgets.html")


@csrf_exempt
@login_required
def types(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    userID = data['userID']
    tipos = Tipo.objects.filter(user=userID)

    tipos.order_by('name').all()

    return JsonResponse([tipo.serialize() for tipo in tipos], safe=False)

@csrf_exempt
@login_required
def getItems(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    userID = data['userID']
    items = Items.objects.filter(user=userID)

    items.order_by('name').all()

    return JsonResponse([item.serialize() for item in items], safe=False)

@csrf_exempt
@login_required
def create_item(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data  = json.loads(request.body)
    user  = data['user']
    name  = data['name']
    tipo  = data['type']
    units = data['units']
    cost  = data['cost']

    tipo_object = Tipo.objects.get(user=user, name=tipo)
    unit_object = Units.objects.get(user=user,name=units)

    item = Items(
        user=user,
        name=name,
        cost = cost)

    item.save()    
    item.type_item.add(tipo_object)
    item.units.add(unit_object)

    return JsonResponse({"message": "Item created successfully."}, status=201)

@csrf_exempt
@login_required
def delete_item(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data  = json.loads(request.body)
    user  = data['user']
    name  = data['name']

    item = Items.objects.get(user=user, name=name)

    item.delete()

    return JsonResponse({"message": "Item deleted successfully."}, status=201)

@csrf_exempt
@login_required
def getBudgets(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data    = json.loads(request.body)
    userID  = data['userID']
    budgets = Budget.objects.filter(user=userID)
    budgets.order_by('timestamp').all()

    return JsonResponse([{'user':budget.user, 'name': budget.name,'timestamp':budget.timestamp} for budget in budgets], safe=False)

@csrf_exempt
@login_required
def create_budget(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    user = data['user']
    name = data['name']
    budget_object = Budget(user=user, name=name)
    budget_object.save()

    return JsonResponse({"message": "Item created successfully."}, status=201)

@csrf_exempt
@login_required
def getProducts(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data    = json.loads(request.body)
    userID  = data['userID']
    name    = data['name']
    budget = Budget.objects.get(user=userID, name=name)

    return JsonResponse(budget.serialize()['productos'], safe=False)

@csrf_exempt
@login_required
def addProduct(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data    = json.loads(request.body)
    userID      = data['userID']
    budgetName  = data['budgetName']
    quantity    = data['quantity']
    nameProduct = data['name']

    budget  = Budget.objects.get(user=userID, name=budgetName)
    item    = Items.objects.get(user=userID, name=nameProduct)

    if Budget.objects.filter(productos__name=nameProduct, name=budgetName ).count() > 0 :
        return JsonResponse({"message": "Item already on budget!."}, status=201)
    else:
        producto = Product(user=userID, name= nameProduct, type_item= item.type_item.all()[0].name, 
                        units=item.units.all()[0].name,cost = item.cost, quantity=quantity)
        producto.save()

        budget.productos.add(producto)

        return JsonResponse({"message": "Product added successfully!"}, status=201)

@csrf_exempt
@login_required
def deleteProduct(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data         = json.loads(request.body)
    user         = data['userID']
    productID    = data['productID']
    budgetName   = data['budgetName']

    budget  = Budget.objects.get(user=user, name=budgetName)
    product = Product.objects.get(user=user, id=productID)

    budget.productos.remove(product)

    product.delete()

    return JsonResponse({"message": "Product deleted successfully."}, status=201)

@csrf_exempt
@login_required
def deleteBudget(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data  = json.loads(request.body)
    user  = data['userID']
    name  = data['budgetName']

    budget = Budget.objects.get(user=user, name=name)

    budget.delete()

    return JsonResponse({"message": "Budget deleted successfully."}, status=201)

@csrf_exempt
@login_required
def units(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    userID = data['userID']
    unidades = Units.objects.filter(user=userID)
    print(unidades)
    unidades.order_by('name').all()

    return JsonResponse([unidad.serialize() for unidad in unidades], safe=False)