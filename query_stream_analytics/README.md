#README Query.txt

A Query deste exemplo recebe os dados de corrente e potência instantânea, para a manipulação destes dados separei os mesmos em 3 saídas, criando 3 outputs seguindo os passos anteriores e utilizando a mesma entrada como IoT Hub criado, a primeira saída enviando somente dados de corrente, a segunda dados de potência por sensor e a terceira dados de potência total.
As funções utilizadas bem como outras funções podem ser encontradas em [Stream Analytics Query Language Reference](https://msdn.microsoft.com/en-us/library/azure/dn834998.aspx).

## Irms

Para a saída utilizando dados de corrente,neste caso não utilisei nenhum tipo de agrupamento de dados simplesmente enviei os dados de entrada para a saída, sem nenhuma manipulação. Porém se caso eu selecionasse somente uma saída e tivesse que utilizar o agrupamento destes dados poderia ser utilizada a função `LAST` que pega os últimos dados lidos no período que achar mais conveniente, coloquei o intervalo como sendo de 3 segundos, pois é a janela de amostragem que meu programa que faz a leitura dos sensores e envia os dados para a nuvem utiliza, então eu estaria pegando cada dado enviado para a nuvem.

##Consumo [KWh]

Somente para ilustrar o cálculo aproximado do consumo de cada sensor ao longo de 1 hora, que é o caso da segunda saída, pegamos a soma das potências lidas através da função `SUM()`, e multiplicamos por 3, que é a janela de tempo utilizada nas medições, e ao agrupar estes dados em uma janela de 1 hora, através da função `TumblingWindow(hh, 1)`, obtivemos os cálculos do consumo em KWh de um aparelho ligado a esta tomada. 

##Consumo Total [KWh]

Já para a terceira saída calculamos a potência aproximada total de todos os sensores, somente somando as potências totais de cada sensor calculada na saída anterior.  



Estes cálculos utilizados são uma forma aproximada da potência consumida em KWh, para obter um cálculo do real consumo deve-se lançar mão de fórmulas que envolvam o cálculo da integral desta potência no tempo analisado, uma vez que a finalidade deste artigo é somente ilustrar o envio de dados e análise e visualização dos mesmos, não nos preocupamos com uma análise matemática fiel dos dados de consumo.
