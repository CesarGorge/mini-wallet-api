from django.urls import reverse
from rest_framework.test import APITestCase
from unittest.mock import patch
from decimal import Decimal
from decouple import config 

class TransactionCreateAPITest(APITestCase):
    @patch('api.views.Web3')
    def test_create_transaction_with_mocked_balance(self, MockWeb3):
        mock_w3_instance = MockWeb3.return_value
        mock_w3_instance.eth.get_balance.return_value = 1000000000000000000
        mock_w3_instance.from_wei.return_value = Decimal('1.0')

        url = reverse('create-transaction')
        data = {'userId': 'user123', 'amount': 100.50, 'currency': 'BTC'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertIn('txId', response.data)
        self.assertEqual(response.data['userId'], 'user123')
        self.assertEqual(Decimal(response.data['amount']), Decimal('100.50'))
        self.assertEqual(response.data['currency'], 'BTC')
        self.assertIn('goerli_balance', response.data)
        self.assertEqual(response.data['goerli_balance']['balance_eth'], '1.0')

        expected_infura_url = config('INFURA_URL')
        expected_wallet = config('SAMPLE_WALLET_ADDRESS')

        MockWeb3.assert_called_once_with(MockWeb3.HTTPProvider(expected_infura_url))
        mock_w3_instance.eth.get_balance.assert_called_once_with(expected_wallet)

    def test_create_transaction_invalid_data(self):
        url = reverse('create-transaction')
        data = {'amount': 100.50, 'currency': 'BTC'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn('userId', response.data)

    def test_create_transaction_invalid_amount_type(self):
        url = reverse('create-transaction')
        data = {'userId': 'user123', 'amount': 'cien', 'currency': 'BTC'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn('amount', response.data)
