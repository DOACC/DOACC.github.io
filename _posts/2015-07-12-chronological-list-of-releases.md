---
layout: post
title: "Chronological list of releases?"
date: 2015-08-28T01:26:54+01:00
modified:
excerpt: "Using DOACC data to answer simple questions."
tags: [rdf]
image:
  feature:
date: 2015-08-28T18:06:11+01:00
---

<h2>Is there a chronological list anywhere for alts as they were released?</h2>

<p>Asked by a bitcointalk subscriber.</p>
<p>Every DOACC record has an “incept” YYYY-MM date, so the query is quite straightforward ...</p>

<div class="ui segment">
<pre>PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>

SELECT ?label ?d WHERE 
{
?node skos:prefLabel ?label .
?node doacc:incept ?d .
}
ORDER BY ?d LIMIT 100</pre>
</div>

<h3>The oldest 100 altcoins ...</h3>
<div class="ui segment">
<table class="ui striped table">
<tr><th class="three wide">name</th><th>incept</th></tr>
<tr><td>Bitcoin</td><td>2009-01</td></tr>
<tr><td>Freicoin</td><td>2011-02</td></tr>
<tr><td>Namecoin</td><td>2011-04</td></tr>
<tr><td>iXcoin</td><td>2011-05</td></tr>
<tr><td>SolidCoin</td><td>2011-08</td></tr>
<tr><td>GeistGeld</td><td>2011-09</td></tr>
<tr><td>I0Coin</td><td>2011-09</td></tr>
<tr><td>RuCoin</td><td>2011-09</td></tr>
<tr><td>Tenebrix</td><td>2011-09</td></tr>
<tr><td>Fairbrix</td><td>2011-10</td></tr>
<tr><td>Litecoin</td><td>2011-10</td></tr>
<tr><td>SolidCoin2</td><td>2011-10</td></tr>
<tr><td>BitChips</td><td>2011-11</td></tr>
<tr><td>CoiledCoin</td><td>2012-01</td></tr>
<tr><td>Realpay</td><td>2012-02</td></tr>
<tr><td>Microcash</td><td>2012-04</td></tr>
<tr><td>Timekoin</td><td>2012-06</td></tr>
<tr><td>BBQCoin</td><td>2012-07</td></tr>
<tr><td>Bytecoin</td><td>2012-07</td></tr>
<tr><td>Starcoin</td><td>2012-07</td></tr>
<tr><td>Peercoin</td><td>2012-08</td></tr>
<tr><td>ZcCoin</td><td>2012-08</td></tr>
<tr><td>TerraCoin</td><td>2012-10</td></tr>
<tr><td>Vertcoin</td><td>2013-01</td></tr>
<tr><td>Novacoin</td><td>2013-02</td></tr>
<tr><td>Bytecoin</td><td>2013-04</td></tr>
<tr><td>Feathercoin</td><td>2013-04</td></tr>
<tr><td>SmallChange</td><td>2013-04</td></tr>
<tr><td>AmericanCoin</td><td>2013-05</td></tr>
<tr><td>BitBar</td><td>2013-05</td></tr>
<tr><td>Bitgem</td><td>2013-05</td></tr>
<tr><td>Digitalcoin</td><td>2013-05</td></tr>
<tr><td>Doubloon</td><td>2013-05</td></tr>
<tr><td>DragonCoin</td><td>2013-05</td></tr>
<tr><td>EZCoin</td><td>2013-05</td></tr>
<tr><td>Elacoin</td><td>2013-05</td></tr>
<tr><td>Fastcoin</td><td>2013-05</td></tr>
<tr><td>Fastcoin2</td><td>2013-05</td></tr>
<tr><td>Franko</td><td>2013-05</td></tr>
<tr><td>GameCoin</td><td>2013-05</td></tr>
<tr><td>Hypercoin</td><td>2013-05</td></tr>
<tr><td>JunkCoin</td><td>2013-05</td></tr>
<tr><td>Luckycoin</td><td>2013-05</td></tr>
<tr><td>Megacoin</td><td>2013-05</td></tr>
<tr><td>Memecoin</td><td>2013-05</td></tr>
<tr><td>Mincoin</td><td>2013-05</td></tr>
<tr><td>Molecule</td><td>2013-05</td></tr>
<tr><td>Nibble</td><td>2013-05</td></tr>
<tr><td>OneCoin</td><td>2013-05</td></tr>
<tr><td>Phenixcoin</td><td>2013-05</td></tr>
<tr><td>Phoenixcoin</td><td>2013-05</td></tr>
<tr><td>Porncoin</td><td>2013-05</td></tr>
<tr><td>Powercoin</td><td>2013-05</td></tr>
<tr><td>Ripple</td><td>2013-05</td></tr>
<tr><td>RoyalCoin</td><td>2013-05</td></tr>
<tr><td>Sexcoin</td><td>2013-05</td></tr>
<tr><td>SkyCoin</td><td>2013-05</td></tr>
<tr><td>SunRiseCoin</td><td>2013-05</td></tr>
<tr><td>SuperCoin</td><td>2013-05</td></tr>
<tr><td>UScoin</td><td>2013-05</td></tr>
<tr><td>Vaginacoin</td><td>2013-05</td></tr>
<tr><td>Weedcoin</td><td>2013-05</td></tr>
<tr><td>WorldCoin</td><td>2013-05</td></tr>
<tr><td>Yacoin</td><td>2013-05</td></tr>
<tr><td>barcoin</td><td>2013-05</td></tr>
<tr><td>6Coin</td><td>2013-06</td></tr>
<tr><td>Anoncoin</td><td>2013-06</td></tr>
<tr><td>Bottlecaps</td><td>2013-06</td></tr>
<tr><td>Copperlark</td><td>2013-06</td></tr>
<tr><td>Cosmoscoin</td><td>2013-06</td></tr>
<tr><td>Cryptobits</td><td>2013-06</td></tr>
<tr><td>Cryptogenic Bullion</td><td>2013-06</td></tr>
<tr><td>Curecoin</td><td>2013-06</td></tr>
<tr><td>Diamond</td><td>2013-06</td></tr>
<tr><td>Emerald</td><td>2013-06</td></tr>
<tr><td>Flashcoin</td><td>2013-06</td></tr>
<tr><td>FlorinCoin</td><td>2013-06</td></tr>
<tr><td>GlobalCoin</td><td>2013-06</td></tr>
<tr><td>IceCoin</td><td>2013-06</td></tr>
<tr><td>Infinitecoin</td><td>2013-06</td></tr>
<tr><td>Krugercoin</td><td>2013-06</td></tr>
<tr><td>LiquidCoin</td><td>2013-06</td></tr>
<tr><td>MasterCoin</td><td>2013-06</td></tr>
<tr><td>Nanotoken</td><td>2013-06</td></tr>
<tr><td>Noirbits</td><td>2013-06</td></tr>
<tr><td>Nucoin</td><td>2013-06</td></tr>
<tr><td>OnelastCoin</td><td>2013-06</td></tr>
<tr><td>Orbitcoin</td><td>2013-06</td></tr>
<tr><td>Quantumcoin</td><td>2013-06</td></tr>
<tr><td>Quickcoin</td><td>2013-06</td></tr>
<tr><td>RealCoin</td><td>2013-06</td></tr>
<tr><td>RedCoin</td><td>2013-06</td></tr>
<tr><td>Richcoin</td><td>2013-06</td></tr>
<tr><td>Sifcoin</td><td>2013-06</td></tr>
<tr><td>TradeCoin</td><td>2013-06</td></tr>
<tr><td>ValueCoin</td><td>2013-06</td></tr>
<tr><td>XenCoin</td><td>2013-06</td></tr>
<tr><td>YbCoin</td><td>2013-06</td></tr>
<tr><td>ZenithCoin</td><td>2013-06</td></tr>
<tr><td>Bestcoin</td><td>2013-07</td></tr>
</table>
</div>
<p>