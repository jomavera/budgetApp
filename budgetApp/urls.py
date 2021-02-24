from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("items", views.items, name="items"),
    path("budgets", views.budgets, name="budgets"),
    path("types", views.types, name="types"),
    path("units", views.units, name="units"),
    path("getItems", views.getItems, name="get_items"),
    path("create_item", views.create_item, name="create_item"),
    path("delete_item", views.delete_item, name="delete_item"),
    path("getBudgets", views.getBudgets, name="get_budgets"),
    path("create_budget", views.create_budget, name="create_budget"),
    path("getProducts", views.getProducts, name="get_products"),
    path("addProduct", views.addProduct, name="add_product"),
    path("deleteProduct", views.deleteProduct, name="delete_product"),
    path("deleteBudget", views.deleteBudget, name="delete_budget"),
]