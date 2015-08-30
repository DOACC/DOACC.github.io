---
layout: post
title: "Total releases in 2014?"
date: 2015-01-03T04:32:11+01:00
modified:
excerpt: "Using DOACC data to answer simple questions."
tags: [rdf]
image:
  feature:
---

<h2>How many altcoins were launched un 2014?</h2>

<p>Asked by a bitcointalk subscriber.</p>
<p>Every DOACC record has an “incept” YYYY-MM date, so the query is quite straightforward ...</p>

<div class="ui segment">
<pre>PREFIX doacc: <http://purl.org/net/bel-epa/doacc#>
SELECT (COUNT(?node) AS ?coins) WHERE 
{
?node doacc:incept ?yearmo
FILTER(?yearmo > '2013-12' && ?yearmo < '2015-01' )
}</pre>
</div>

<h3>more than you expected?</h3>

<div class="ui segment">
<table class="ui striped table">
<tr><th>coins</th></tr>
<tr><td>1705</td></tr>
</table>
</div>