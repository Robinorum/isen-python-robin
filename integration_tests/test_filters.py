from django.urls import reverse
from django.test import Client
import pytest

from products.models import Product

CLIENT = Client()

@pytest.mark.django_db
def test_price_filter_ui_presence():
    """
    Vérifie que l'interface de filtrage est bien présente sur la page d'accueil
    """
    
    response = CLIENT.get(reverse('home'))
    content = response.content.decode()
    
    
    assert 'min_price' in content
    assert 'max_price' in content
    assert 'Prix minimum' in content
    assert 'Prix maximum' in content
    assert 'Filtrer' in content

@pytest.mark.django_db
def test_price_filter_functionality():
    """
    Vérifie que le filtre de prix fonctionne correctement avec l'interface
    """
    
    Product.objects.create(name="Produit1", image="img1.jpg", description="Description1", price=10.00)
    Product.objects.create(name="Produit2", image="img2.jpg", description="Description2", price=20.00)
    Product.objects.create(name="Produit3", image="img3.jpg", description="Description3", price=30.00)
    Product.objects.create(name="Produit4", image="img4.jpg", description="Description4", price=40.00)
    
    
    response = CLIENT.get(reverse('home') + '?min_price=25')
    content = response.content.decode()
    
    assert "Produit1" not in content
    assert "Produit2" not in content
    assert "Produit3" in content
    assert "Produit4" in content
    
    
    response = CLIENT.get(reverse('home') + '?max_price=25')
    content = response.content.decode()
    
    assert "Produit1" in content
    assert "Produit2" in content
    assert "Produit3" not in content
    assert "Produit4" not in content
    
   
    response = CLIENT.get(reverse('home') + '?min_price=15&max_price=35')
    content = response.content.decode()
    
    assert "Produit1" not in content
    assert "Produit2" in content
    assert "Produit3" in content
    assert "Produit4" not in content

@pytest.mark.django_db
def test_price_filter_reset_button():
    """
    Vérifie que le bouton de réinitialisation apparaît uniquement lorsque des filtres sont actifs
    """
    
    Product.objects.create(name="Produit1", image="img1.jpg", description="Description1", price=10.00)
    
    
    response = CLIENT.get(reverse('home'))
    content = response.content.decode()
    assert "Réinitialiser" not in content
    
    
    response = CLIENT.get(reverse('home') + '?min_price=5')
    content = response.content.decode()
    assert "Réinitialiser" in content
