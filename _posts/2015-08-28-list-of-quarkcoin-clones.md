---
layout: post
title: "List of Quarkcoin clones?"
modified:
excerpt: "Using DOACC data to answer simple questions."
tags: [rdf]
image:
  feature:
date: 2015-08-28T18:06:11+01:00
link: list-of-quarkcoin-clones
---

<h2 style="margin-top:2em">Quarkcoin clones, which ones are still floating around out there?</h2>
<p>Asked by a bitcointalk poster. To get the answer according to DOACC, pose a straightforward SPARQL query of the dataset...</p>
<div class="ui segment">
<pre>PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?node ?name ?symbol ?alg ?date ?status
WHERE {
    ?pows skos:prefLabel "quark"@en .
    ?node doacc:pow ?pows .
    ?node skos:prefLabel ?name .
    ?node doacc:symbol ?symbol .
    ?node doacc:incept ?date .
    ?node doacc:expiration ?status .
} ORDER BY ?name</pre>
</div>

<h3>There’s a fair few ...</h3>

<div class="ui segment">
<table class="ui striped table">
<tr><th class="five wide">node </th><th class="three wide">name </th><th class="one wide"> symbol </th><th class="two wide"> date </th><th class="one wide"> status </th></tr>
<tr><td>doacc:D569522b5-fbbb-43ab-b2d7-5a94fec35de4</td><td>2CHcoin</td><td>2CH</td><td>2014-01</td><td>listed</td></tr>
<tr><td>doacc:Dbaab6478-32a5-4446-a566-fdad6bcc045d</td><td>Animecoin</td><td>ANI</td><td>2014-02</td><td>listed</td></tr>
<tr><td>doacc:D97533e03-b7ac-4e0d-87a5-d9da5f4aec54</td><td>Atencoin</td><td>ATEN</td><td>2014-03</td><td>unlaunched</td></tr>
<tr><td>doacc:D35879799-9b78-4f1d-a1c8-ae5005e7c37a</td><td>Atomcoin</td><td>ATO</td><td>2013-12</td><td>defunct</td></tr>
<tr><td>doacc:D4578512a-9bf6-4fa8-9652-bd2de049d149</td><td>BMWcoin</td><td>BMC</td><td>2014-01</td><td>extant</td></tr>
<tr><td>doacc:Db261d878-04ad-416e-a405-f418d24709e1</td><td>BitCrystal</td><td>BTCRY</td><td>2014-10</td><td>extant</td></tr>
<tr><td>doacc:Dd7cdae4e-9a74-4fa8-80d8-e8fbfb94d5ca</td><td>BitQuark</td><td>BTQ</td><td>2014-03</td><td>listed</td></tr>
<tr><td>doacc:D1e9d855e-22cf-4cec-9d2b-114fff8edb7a</td><td>Bullcoin</td><td>TBC</td><td>2014-01</td><td>extant</td></tr>
<tr><td>doacc:Dbd6104d8-8812-43ac-b9fe-b11548edd83c</td><td>C-Note</td><td>CNOTE</td><td>2014-01</td><td>listed</td></tr>
<tr><td>doacc:D78ae4222-f6c4-4691-a424-8f0366b75085</td><td>CPU2Coin</td><td>CP2</td><td>2013-08</td><td>defunct</td></tr>
<tr><td>doacc:D3383d987-fc58-4e72-a934-a7de94736df5</td><td>Coinlabcoin</td><td>LAB</td><td>2014-06</td><td>extant</td></tr>
<tr><td>doacc:D97c32c01-e119-4a3d-9232-a1756da86726</td><td>Dimecoin</td><td>DIME</td><td>2013-12</td><td>listed</td></tr>
<tr><td>doacc:D5350c975-610c-473e-b547-7e96afffd37c</td><td>Dougcoin</td><td>DOUG</td><td>2014-03</td><td>extant</td></tr>
<tr><td>doacc:Dc7d0b89a-f7fb-46ab-a856-b5c3532e6776</td><td>Ducats</td><td>DUC</td><td>2014-01</td><td>listed</td></tr>
<tr><td>doacc:D6081cbea-5cb2-4ff1-a120-a542ef64920b</td><td>EasterCoin</td><td>ETR</td><td>2014-05</td><td>extant</td></tr>
<tr><td>doacc:D2cfb1998-cc85-4c04-bcb3-22cfeb5ce3cf</td><td>Fairquark</td><td>FRQ</td><td>2014-01</td><td>listed</td></tr>
<tr><td>doacc:Dde59c79c-d69e-4bd0-a899-49753c8c2cb8</td><td>FrozenCoin</td><td>FZ</td><td>2013-12</td><td>listed</td></tr>
<tr><td>doacc:D3b80124c-50f4-4773-8b97-4f2f5225d8c5</td><td>Internationalcoin</td><td>INC</td><td>2014-03</td><td>extant</td></tr>
<tr><td>doacc:D625963e9-c2ca-4597-9def-2eff6a4fc37e</td><td>KFcoin</td><td>KFC</td><td>2014-02</td><td>extant</td></tr>
<tr><td>doacc:Dd32a8369-1868-4071-a5b4-04f1239bbff3</td><td>Kimcoin</td><td>KMC</td><td>2014-04</td><td>inactive</td></tr>
<tr><td>doacc:D2a5a836e-3579-4f6f-8525-0fa05c35b3e4</td><td>Kumacoin</td><td>KUMA</td><td>2014-04</td><td>listed</td></tr>
<tr><td>doacc:Dea96626d-5f4f-4548-8c27-36995f2915de</td><td>Metacoin</td><td>MET</td><td>2014-02</td><td>defunct</td></tr>
<tr><td>doacc:Dbddc97b3-cb80-41be-a1c2-eb10f65b5cae</td><td>Mimiccoin</td><td>MMC</td><td>2014-06</td><td>extant</td></tr>
<tr><td>doacc:Dd07239ac-9c0c-48e9-bac6-854ef475220e</td><td>Minicoin</td><td>MINI</td><td>2014-02</td><td>extant</td></tr>
<tr><td>doacc:Dbc8ed875-db11-4c53-8505-3c507dae6020</td><td>Molecule</td><td>MOL</td><td>2013-05</td><td>extant</td></tr>
<tr><td>doacc:Dce6a4117-271c-4ab4-bcb8-3cf7b09325c4</td><td>MonetaryUnitcoin</td><td>MUE</td><td>2014-09</td><td>extant</td></tr>
<tr><td>doacc:D789c6bc6-bfd6-4454-b44d-c86e540e5de4</td><td>Monkeycoin</td><td>MKY</td><td>2014-02</td><td>stopped</td></tr>
<tr><td>doacc:D2c829bb2-6727-483f-9176-2ca75b6ecf6c</td><td>Netcoin2</td><td>NET2</td><td>2014-02</td><td>extant</td></tr>
<tr><td>doacc:D34cc64ca-d516-46a3-8e4b-b225fc823b65</td><td>O2oCoin</td><td>O2O</td><td>2014-03</td><td>extant</td></tr>
<tr><td>doacc:Ddf3f3a71-a9d6-4737-9f8a-9eaa08a9d6db</td><td>Oxcoin</td><td>OXC</td><td>2014-03</td><td>extant</td></tr>
<tr><td>doacc:D6c84f4d0-9b18-4498-9aec-4dba3425c3a4</td><td>Particle</td><td>PRT</td><td>2013-12</td><td>listed</td></tr>
<tr><td>doacc:D4ac63f81-ab7f-46f7-a578-63b269ff799f</td><td>Photoncoin</td><td>PHO</td><td>2014-01</td><td>extant</td></tr>
<tr><td>doacc:Dfeb2705b-82d8-4f02-ab15-71a542666846</td><td>Populacecoin</td><td>POC</td><td>2014-03</td><td>inactive</td></tr>
<tr><td>doacc:D8b801923-651c-4acf-89ea-79d31fd8753e</td><td>Probe</td><td>PROBE</td><td>2014-04</td><td>defunct</td></tr>
<tr><td>doacc:D609b63b1-c4d1-4c8d-a2cc-df2d75514c59</td><td>QuarkBar</td><td>QB</td><td>2014-03</td><td>listed</td></tr>
<tr><td>doacc:Df65021e1-dab8-4605-98a7-effc638720fa</td><td>QuarkCoin</td><td>QRK</td><td>2013-07</td><td>listed</td></tr>
<tr><td>doacc:De59358f4-4a72-40f8-84f4-c932c0249237</td><td>RVDCoin</td><td>RVD</td><td>2013-12</td><td>extant</td></tr>
<tr><td>doacc:De8640d5c-82c3-4623-966a-9464a3e1fab3</td><td>Randomquark</td><td>RQC</td><td>2014-03</td><td>extant</td></tr>
<tr><td>doacc:Db0142c92-e92f-4c78-b4be-5b4876001ab1</td><td>Secondscoin</td><td>SEC</td><td>2013-12</td><td>inactive</td></tr>
<tr><td>doacc:D65ce99c6-171c-4a38-8743-2b1a28cd3790</td><td>SecureCoin</td><td>SRC</td><td>2013-08</td><td>listed</td></tr>
<tr><td>doacc:Dd09e203a-0a63-44d3-9906-51e69aa4255a</td><td>Seedbit</td><td>SED</td><td>2015-05</td><td>extant</td></tr>
<tr><td>doacc:D8d78813b-6269-499d-a74f-02e985ba796a</td><td>Sharkcoin</td><td>SAK</td><td>2014-05</td><td>extant</td></tr>
<tr><td>doacc:D520229b8-bbc3-4f15-9b6e-2229d942cb14</td><td>Somacoin</td><td>SOMA</td><td>2014-02</td><td>extant</td></tr>
<tr><td>doacc:Dfed93fb0-aee7-4a94-b4cd-3e08602e8d79</td><td>Unioncoin</td><td>UNC</td><td>2013-12</td><td>listed</td></tr>
<tr><td>doacc:D80ffbd68-904b-41eb-bdfe-c9eea892ecaf</td><td>Vanillacoin</td><td>VLD</td><td>2014-01</td><td>defunct</td></tr>
<tr><td>doacc:Dd93864da-ea92-435b-bcad-a3dca8e988df</td><td>WFPcoin</td><td>WFP</td><td>2014-03</td><td>extant</td></tr>
<tr><td>doacc:D201d5ab5-873a-4bab-ac09-d1faf9dd5af6</td><td>WikiCoin</td><td>WIKI</td><td>2014-02</td><td>listed</td></tr>
<tr><td>doacc:D38f9c514-a2a4-4557-a148-550b4189697f</td><td>Zurcoin</td><td>ZUR</td><td>2013-12</td><td>extant</td></tr>
</table>
</div>

<hr>

<h2>How about Qubitcoin clones?</h2>
<p>Just change the target label ...</p>

<div class="ui segment">
<pre>PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?node ?name ?symbol ?date ?status
WHERE {
    ?pows skos:prefLabel "qubit"@en .
    ?node doacc:pow ?pows .
    ?node skos:prefLabel ?name .
    ?node doacc:symbol ?symbol .
    ?node doacc:incept ?date .
    ?node doacc:expiration ?status .
} ORDER BY ?name</pre>
</div>

<h3>Not so many results ...</h3>

<div class="ui segment">
<table class="ui striped table">
<tr><th class="five wide">node </th><th class="three wide">name </th><th class="one wide"> symbol </th><th class="two wide"> date </th><th class="one wide"> status </th></tr>
<tr><td>doacc:Db03dbb3b-0164-4fb0-b874-170b58b0087b</td><td> Ascensioncoin</td><td>ASN</td><td>2015-03</td><td>extant</td></tr>
<tr><td>doacc:Df8b77f54-6bdc-4588-9fb8-e4496dcac79f</td><td> Cassubian Detk</td><td>CDT</td><td>2014-07</td><td>listed</td></tr>
<tr><td>doacc:D655e5d25-cf10-4c1c-9ac2-5213f5ca50c3</td><td> Cypher</td><td>CYP</td><td>2015-03</td><td>unlaunched</td></tr>
<tr><td>doacc:D8cab32c5-62d9-4890-986f-be58e5951b0a</td><td> Droidz</td><td>DRZ</td><td>2015-04</td><td>unlaunched</td></tr>
<tr><td>doacc:D8bf8c53a-b52d-494f-a2a2-eac44e98b841</td><td> Endthebloodshed</td><td>BLOOD</td><td>2014-07</td><td>unlaunched</td></tr>
<tr><td>doacc:Ded37a23d-d81e-4fae-aa64-f34365312608</td><td> QubitCoin</td><td>Q2C</td><td>2014-01</td><td>listed</td></tr>
<tr><td>doacc:D652cb1f7-7d60-4d09-a627-9d92fb2be5c3</td><td> Venturenic</td><td>VTN</td><td>2015-05</td><td>extant</td></tr>
<tr><td>doacc:Dd7c0eb5b-82ad-4e58-b386-39c05595340b</td><td> Xryptbitcoin</td><td>XBIT</td><td>2014-08</td><td>defunct</td></tr>
</table>
</div>
<hr>


<h2>What other labels are there?</h2>

<p>To list all the known pow schemes ...</p>
<div class="ui segment">
<pre>PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT(?pows as ?powscheme) ?name WHERE {
    ?node doacc:pow ?pows .
    ?pows skos:prefLabel ?name .
} ORDER BY ?name</pre>
</div>

<h3>Node id and label for all 72 known pow schemes ...</h3>

<div class="ui segment">
<table class="ui striped table">
<tr><th class="five wide">powscheme</th><th class="three wide">name</th></tr>
<tr><td>doacc:Db0776e4c-d947-435a-9523-f8ba03ece9dd</td><td>3s</td></tr>
<tr><td>doacc:D61137b39-d1fa-4340-87e3-cc4e045dbf38</td><td>BLAKE</td></tr>
<tr><td>doacc:D3f57e33a-2f73-4f63-9a5f-7455cd22a6cf</td><td>BLAKE2b</td></tr>
<tr><td>doacc:D195a7796-6815-48ac-b8f1-9d7e55a3ff5e</td><td>Dagger</td></tr>
<tr><td>doacc:Dbb0805c4-d10b-432b-9934-031970cbd581</td><td>Fugue</td></tr>
<tr><td>doacc:D52a83fcf-495f-4ffc-b33f-c9c6e2ea8f77</td><td>Grøstl</td></tr>
<tr><td>doacc:D278ffa1d-aab4-4bbb-8d43-dddb6b719703</td><td>JH</td></tr>
<tr><td>doacc:Dac4149f8-e51d-4621-ab26-6e5805e18b5c</td><td>Luffa</td></tr>
<tr><td>doacc:D8a193ca2-120a-49ec-aaba-3186b0990920</td><td>NeoScrypt</td></tr>
<tr><td>doacc:D8cac5ac6-c2cb-4e77-a233-8c04a3d5b0a5</td><td>Obelisk</td></tr>
<tr><td>doacc:Dafa61bb2-1f76-4158-ada5-0720148f6b11</td><td>SHA1-256</td></tr>
<tr><td>doacc:D0441786b-85a1-45a6-a50d-1a9b80ec7b94</td><td>SHA2-256</td></tr>
<tr><td>doacc:Dac22b64d-5836-4e89-94ac-653591e14532</td><td>SHA2-512</td></tr>
<tr><td>doacc:D9a083580-c5ee-46ba-b557-efcc098e99c5</td><td>SHA3-256</td></tr>
<tr><td>doacc:D3dd3dc75-805c-4cff-81db-f7b753a4901e</td><td>SHA3-512</td></tr>
<tr><td>doacc:Dacc8b5c4-19d2-4897-94f6-29cb402f7faa</td><td>Skein</td></tr>
<tr><td>doacc:Da7620bb3-f36b-4ebe-88e7-0040153276c5</td><td>Twister</td></tr>
<tr><td>doacc:D77f87232-5767-41b5-b678-99f987bb3886</td><td>Whirlpool</td></tr>
<tr><td>doacc:D6979b502-73eb-469a-aee6-5cd1e9b2b5bf</td><td>bcrypt</td></tr>
<tr><td>doacc:D4d73d537-64c3-4e49-b96c-5b1ab0e34885</td><td>boinc</td></tr>
<tr><td>doacc:Dc54da4cd-5253-40ee-9635-e57db1292120</td><td>c11</td></tr>
<tr><td>doacc:Ddcfbf087-8443-4fc2-8cf1-a2112cfbedd8</td><td>captcha</td></tr>
<tr><td>doacc:D77f94d10-71ab-444e-8300-800d4ce9d7c5</td><td>cryptonight</td></tr>
<tr><td>doacc:D28483031-b854-4853-9a35-e1daf97e4c59</td><td>dcrypt</td></tr>
<tr><td>doacc:Dc8cecbd1-03ec-48d1-a687-5966753d6f50</td><td>ellipticcurve</td></tr>
<tr><td>doacc:D672476f2-1405-4028-959e-fd813a05acd3</td><td>folding</td></tr>
<tr><td>doacc:D6199a4b5-dba5-44bf-8f27-85566596c6b3</td><td>fresh</td></tr>
<tr><td>doacc:D3b0721fa-edbd-4cdb-b7f4-2bc5030097bd</td><td>friction</td></tr>
<tr><td>doacc:D2018f8a5-5ed8-40b2-a466-b7faddcb65b2</td><td>hefty1</td></tr>
<tr><td>doacc:D6bfb0491-3b69-4041-9c6e-5b1a24fc8606</td><td>intercoin</td></tr>
<tr><td>doacc:D0475d1aa-1f82-40c6-ac65-120b7d78f92d</td><td>jackpot</td></tr>
<tr><td>doacc:Db0776e4c-d947-435a-9523-f8ba03ece9dd</td><td>kshake320</td></tr>
<tr><td>doacc:D4d21e95f-70f0-4d85-9f86-cc31afc08651</td><td>lyra2re</td></tr>
<tr><td>doacc:D11d1283f-4489-4c57-ad28-2eb07299e981</td><td>m7</td></tr>
<tr><td>doacc:Db63a998e-75c9-4b6f-8cba-60d96ebc3bae</td><td>momentum</td></tr>
<tr><td>doacc:De706dccf-5a54-440e-852e-884fc44dd21d</td><td>momsha</td></tr>
<tr><td>doacc:Dbf37e4ce-3717-4011-abf5-354e475e117e</td><td>myriad</td></tr>
<tr><td>doacc:D532a50ff-94d9-4af3-b294-bc23eb726c8a</td><td>nist5</td></tr>
<tr><td>doacc:De0f1bac2-0305-46d1-9d4b-13d90bf8b80c</td><td>nist6</td></tr>
<tr><td>doacc:Da8dc43e2-3e92-41f8-b7f3-b36dcb7196c5</td><td>novel</td></tr>
<tr><td>doacc:D38e13703-ad45-4210-8815-17238ccd0691</td><td>ocean</td></tr>
<tr><td>doacc:D34e0bbb4-cfc5-41a3-851e-fa8baef21d02</td><td>pluck-128</td></tr>
<tr><td>doacc:D9f36ba98-cc70-4120-b1a6-d8cc75abdb98</td><td>prime6</td></tr>
<tr><td>doacc:D38ff1442-5d46-4c97-8950-3fbbdf705a0d</td><td>primechain</td></tr>
<tr><td>doacc:Df0bce76f-f04e-4eda-8d20-461edf794e89</td><td>primeconstellation</td></tr>
<tr><td>doacc:D2e786dc0-a5b6-4441-8d0f-7fa6722bb568</td><td>primegap</td></tr>
<tr><td>doacc:D67af5c41-6b6e-40d3-9eba-f4d92b46f71e</td><td>quark</td></tr>
<tr><td>doacc:Db435df5d-bc7e-4794-b7db-e83980b4f97d</td><td>qubit</td></tr>
<tr><td>doacc:D1da974db-6001-4cf0-b97f-3c84a5b26d6c</td><td>radix</td></tr>
<tr><td>doacc:D480d9f82-c725-4da7-9d0d-3399d6808e52</td><td>realpay</td></tr>
<tr><td>doacc:D63aa1e55-d517-4da6-b399-1b117351f542</td><td>ripple</td></tr>
<tr><td>doacc:D37606e95-3d60-41be-ac92-188f6e5f17bd</td><td>roulette</td></tr>
<tr><td>doacc:D338257f8-402f-4c76-969b-6fc041d52e40</td><td>scrypt</td></tr>
<tr><td>doacc:Dae4893bc-27c5-43c5-9be5-7d1665bdf473</td><td>scrypt-j</td></tr>
<tr><td>doacc:D943e4360-d62a-4a73-9498-b8c3293be0e3</td><td>scrypt-j-n</td></tr>
<tr><td>doacc:D89d90923-19e8-467b-91fd-134bd7b219d1</td><td>scrypt-n</td></tr>
<tr><td>doacc:D065850e9-9912-4983-9ac3-2ece19e55f32</td><td>scrypt-n-f</td></tr>
<tr><td>doacc:Dda69a712-877a-40f9-974d-70007d7b30e0</td><td>scrypt-n-m</td></tr>
<tr><td>doacc:D7ee44a22-8d89-400e-a531-279d64a0549a</td><td>scrypt-n-r</td></tr>
<tr><td>doacc:Df9a5ca0a-18ff-4274-a14f-f7b8097ea851</td><td>shanghai</td></tr>
<tr><td>doacc:D33cc65eb-4991-4f27-b67e-a712548a059e</td><td>thiamine</td></tr>
<tr><td>doacc:D8a26983f-906a-469d-93d7-a75f63ca5e10</td><td>trisha</td></tr>
<tr><td>doacc:Ddf437316-7af3-4190-a4dc-b23566f6a354</td><td>twe</td></tr>
<tr><td>doacc:D7be57c39-9dd2-4ea8-a16d-38d5d6cf5779</td><td>unknown</td></tr>
<tr><td>doacc:D06c1c81c-fe9e-4377-b33a-11705525a58b</td><td>x11</td></tr>
<tr><td>doacc:D6faa165d-2e2b-4fe6-ae74-97aa13ed920f</td><td>x12</td></tr>
<tr><td>doacc:D19155d96-f19d-4976-8f20-6434e3599186</td><td>x13</td></tr>
<tr><td>doacc:De50372a5-3d3c-4408-ad0e-532a4258c328</td><td>x14</td></tr>
<tr><td>doacc:Db77be7da-20ea-46ef-b93d-8cc5bcf30804</td><td>x15</td></tr>
<tr><td>doacc:Dbe452947-5970-4386-91a3-e447c9a37885</td><td>x17</td></tr>
<tr><td>doacc:D26f3148e-6f7f-4b92-90f3-b42455e883f9</td><td>xg</td></tr>
<tr><td>doacc:D211d6200-8c02-4219-9e3f-a65d406dafb5</td><td>yescrypt</td></tr>
</table>
</div>
<p>The results of the above query are listed on the <a href="{{site.url}}/facts/powschemes.html">PoW</a> page in the Facts section.</p>

---

<div><a markdown="0" href="{{ site.url }}/news" class="btn">BACK: News</a></div>
