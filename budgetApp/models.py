from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Items(models.Model):
    user  = models.IntegerField()
    name  = models.CharField(max_length=255)
    cost  = models.IntegerField()
    type_item  = models.ManyToManyField("Tipo", related_name="typeProd", symmetrical=False)
    units      = models.ManyToManyField("Units", related_name="units", symmetrical=False)

    def serialize(self):
        return {
            "user": self.user,
            "name": self.name,
            "cost": self.cost,
            "type": [tipo.name for tipo in self.type_item.all()],
            "units": [unit.name for unit in self.units.all()]
        }

class Units(models.Model):
    user = models.IntegerField(default=1)
    name = models.CharField(max_length=255)

    def serialize(self):
        return {
            "user": self.user,
            "name": self.name
        }

class Tipo(models.Model):
    user = models.IntegerField(default=1)
    name = models.CharField(max_length=255)

    def serialize(self):
        return {
            "user": self.user,
            "name": self.name
        }
class Product(models.Model):

    user  = models.IntegerField()
    name  = models.CharField(max_length=255)
    cost  = models.IntegerField()
    type_item  = models.CharField(max_length=255)
    units      = models.CharField(max_length=255)
    quantity = models.IntegerField()

    def serialize(self):
        return {
            "id"  : self.id,
            "user": self.user,
            "name": self.name,
            "cost": self.cost,
            "type": self.type_item,
            "units": self.units,
            "quantity": self.quantity
        }

class Budget(models.Model):

    user      = models.IntegerField(default=1)
    name      = models.CharField(max_length=255)
    productos = models.ManyToManyField("Product", related_name="productos", symmetrical=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):

        return {
            "user": self.user,
            "name": self.name,
            "productos": [product.serialize() for product in self.productos.all()],
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }



