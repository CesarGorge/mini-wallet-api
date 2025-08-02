from django.db import models
import uuid

class Transaction(models.Model):
    txId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userId = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)

    def __str__(self):
        return f'{self.amount} {self.currency} - {self.userId}'
