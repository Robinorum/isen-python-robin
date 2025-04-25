from django.test import Client
from django.urls import reverse
import pytest

from products.models import Product


# pylint: disable=no-member


@pytest.mark.django_db
def test_price_filter_min():
    """
    Test que le filtre de prix minimum fonctionne
    """
    Product.objects.create(name="Produit1", image="img1.jpg", description="Description1", price=10.00)
    Product.objects.create(name="Produit2", image="img2.jpg", description="Description2", price=20.00)
    Product.objects.create(name="Produit3", image="img3.jpg", description="Description3", price=30.00)
    
    client = Client()
    
    response = client.get(reverse('home') + '?min_price=15')
    
    assert len(response.context['object_list']) == 2
    for product in response.context['object_list']:
        assert product.price >= 15


@pytest.mark.django_db
def test_price_filter_max():
    """
    Test que le filtre de prix maximum fonctionne
    """
    Product.objects.create(name="Produit1", image="img1.jpg", description="Description1", price=10.00)
    Product.objects.create(name="Produit2", image="img2.jpg", description="Description2", price=20.00)
    Product.objects.create(name="Produit3", image="img3.jpg", description="Description3", price=30.00)
    
    client = Client()
    
    response = client.get(reverse('home') + '?max_price=25')
    
    assert len(response.context['object_list']) == 2
    for product in response.context['object_list']:
        assert product.price <= 25


@pytest.mark.django_db
def test_price_filter_range():
    """
    Test que le filtre de prix entre un min et un max fonctionne
    """

    Product.objects.create(name="Produit1", image="img1.jpg", description="Description1", price=10.00)
    Product.objects.create(name="Produit2", image="img2.jpg", description="Description2", price=20.00)
    Product.objects.create(name="Produit3", image="img3.jpg", description="Description3", price=30.00)
    Product.objects.create(name="Produit4", image="img4.jpg", description="Description4", price=40.00)
    
    client = Client()
    

    response = client.get(reverse('home') + '?min_price=15&max_price=35')
    
    assert len(response.context['object_list']) == 2
    for product in response.context['object_list']:
        assert 15 <= product.price <= 35


@pytest.mark.django_db
def test_price_filter_invalid_values():
    """
    Test que des valeurs invalides sont gérées correctement
    """
    Product.objects.create(name="Produit1", image="img1.jpg", description="Description1", price=10.00)
    Product.objects.create(name="Produit2", image="img2.jpg", description="Description2", price=20.00)
    
    client = Client()
    
    response = client.get(reverse('home') + '?min_price=abc')

    assert len(response.context['object_list']) == 2