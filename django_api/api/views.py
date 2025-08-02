from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TransactionSerializer
from decouple import config
from web3 import Web3

class TransactionCreateView(APIView):
    """
    Crea una transacción y añade el saldo de ETH en Goerli a la respuesta.
    """
    def post(self, request, *args, **kwargs):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            infura_url = config('INFURA_GOERLI_URL')
            w3 = Web3(Web3.HTTPProvider(infura_url))
            balance_wei = w3.eth.get_balance(config('SAMPLE_WALLET_ADDRESS'))
            balance_eth = w3.from_wei(balance_wei, 'ether')

            response_data = serializer.data
            response_data['goerli_balance'] = {
                'balance_eth': str(balance_eth)
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)