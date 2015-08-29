<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/stylesheets/assets/xsltdoc.xsl" type="text/xsl" media="screen"?>
<!DOCTYPE xsl:stylesheet [
 <!ENTITY rdf  'http://www.w3.org/1999/02/22-rdf-syntax-ns#'>
 <!ENTITY rdfs 'http://www.w3.org/2000/01/rdf-schema#'>
 <!ENTITY owl  'http://www.w3.org/2002/07/owl#'>
 <!ENTITY dc   'http://purl.org/dc/elements/1.1/'>
 <!ENTITY ont  'http://purl.org/net/ns/ontology-annot#'>
 <!ENTITY asserted-class  "local-name(.)='Class' or name()='owl:DeprecatedClass' or rdf:type/@rdf:resource='&rdfs;Class' or rdf:type/@rdf:resource='&owl;Class'"> 
 <!ENTITY inferred-class  "rdfs:subClassOf or parent::rdfs:domain or parent::rdfs:range"> 
 <!ENTITY class-cond  "&asserted-class; or &inferred-class;">
 <!ENTITY asserted-prop  "contains(local-name(.),'Property') or contains(rdf:type/@rdf:resource,'Property')"> 
 <!ENTITY inferred-prop  "rdfs:subPropertyOf or rdfs:domain or rdfs:range"> 
 <!ENTITY prop-cond  "&asserted-prop; or &inferred-prop;">
]>
<!--このファイルはUTF-8-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rdf="&rdf;"
  xmlns:rdfs="&rdfs;"
  xmlns:owl="&owl;"
  xmlns:h="http://www.w3.org/1999/xhtml"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:dc="&dc;"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:foaf="http://xmlns.com/foaf/0.1/"
  xmlns:ex="http://purl.org/net/ns/ex#"
  xmlns:doas="http://purl.org/net/ns/doas#"
  xmlns:ont="&ont;"
  xmlns:vs="http://www.w3.org/2003/06/sw-vocab-status/ns#"
  exclude-result-prefixes="rdf rdfs dc owl dcterms ex doas ont vs"
>

 <xsl:output indent="yes"/>
 <xsl:param name="xmlfile"/><!--** target xml file name if the parameter is provided by sysytem -->
 <!-- avoid Opera error
 <xsl:variable name="_doas" select="document('')//rdf:Description[1]"/>
 -->

 <xsl:template name="_doas_description">
  <rdf:RDF xmlns="http://purl.org/net/ns/doas#">
   <rdf:Description rdf:about="">
    <title>RDFS/OWL presentation stylesheet</title>
    <description>This stylesheet is designed to convert RDF Schema / OWL Ontology file to visible XHTML with structured definition list, with class/property trees as the table of contents.</description>
    <author rdf:parseType="Resource">
     <name>Masahide Kanzaki</name>
     <homepage rdf:resource="http://www.kanzaki.com/"/>
    </author>
    <created>2003</created>
    <release rdf:parseType="Resource">
     <revision>2.3.8</revision>
     <created>2010-11-12</created>
    </release>
    <rights>(c) 2003-2008 by the author, copyleft under LGPL</rights>
    <license rdf:resource="http://creativecommons.org/licenses/LGPL/2.1/"/>
   </rdf:Description>
  </rdf:RDF>
 </xsl:template>


 <xsl:variable name="classes" select="/rdf:RDF/*[&class-cond;]"/><!--** all class elements -->
 <xsl:variable name="properties" select="/rdf:RDF/*[&prop-cond;]"/><!--** all property elements -->
 <!-- find namespace URI -->
 <xsl:variable name="defns" select="/rdf:RDF/namespace::*[name()='']"/><!--** default namespace URI (Note namespace:: does not work in Mozilla) -->

 <xsl:variable name="nsuri-body"><!--** find namespace uri 'body' (difficult !)-->
  <xsl:variable name="nstestlen" select="string-length($xmlfile)-9"/><!-- -->
  <xsl:choose>
   <!-- if xml:base found, use it -->
   <xsl:when test="/rdf:RDF/@xml:base">
    <xsl:value-of select="/rdf:RDF/@xml:base"/>
   </xsl:when>
   <!-- if isDefinedBy found, use it -->
   <xsl:when test="/rdf:RDF/*/rdfs:isDefinedBy">
    <xsl:value-of select="/rdf:RDF/*/rdfs:isDefinedBy/@rdf:resource"/>
   </xsl:when>
   <!-- if $xmlfile provided, use it -->
   <xsl:when test="$xmlfile != ''">
    <xsl:choose>
     <xsl:when test="substring($xmlfile,$nstestlen)='/index.rdf'">
      <xsl:value-of select="substring($xmlfile,1,$nstestlen)"/>
     </xsl:when>
     <!-- otherwise, use xmlfile if possible -->
     <xsl:otherwise>
      <xsl:value-of select="$xmlfile"/>
     </xsl:otherwise>
    </xsl:choose>
   </xsl:when>
   <!-- if ontology/schema description has non empty rdf:about, use it -->
   <xsl:when test="starts-with(/rdf:RDF/owl:Ontology/@rdf:about,'http:')">
    <xsl:value-of select="/rdf:RDF/owl:Ontology/@rdf:about"/>
   </xsl:when>
   <!-- if first item of classes or properties has uri with '#', use upto '#' -->
   <xsl:when test="contains(substring($classes[1]/@rdf:about,2),'#')">
    <xsl:value-of select="concat(substring-before($classes[1]/@rdf:about,'#'),'#')"/>
   </xsl:when>
   <xsl:when test="contains(substring($properties[1]/@rdf:about,2),'#')">
    <xsl:value-of select="concat(substring-before($properties[1]/@rdf:about,'#'),'#')"/>
   </xsl:when>
   <!-- if first item of classes or properties has isDefinedBy, use it -->
   <xsl:when test="$classes[1]/rdfs:isDefinedBy">
    <xsl:value-of select="$classes[1]/rdfs:isDefinedBy/@rdf:resource"/>
   </xsl:when>
   <xsl:when test="$properties[1]/rdfs:isDefinedBy">
    <xsl:value-of select="$properties[1]/rdfs:isDefinedBy/@rdf:resource"/>
   </xsl:when>
   <!-- if default namespace uri presents, use it -->
   <xsl:when test="$defns">
    <xsl:value-of select="$defns"/>
   </xsl:when>
   <xsl:otherwise>
    <xsl:value-of select="'unknown'"/>
   </xsl:otherwise>
  </xsl:choose>
 </xsl:variable>
 
 <xsl:variable name="defnspfx">
  <xsl:choose>
   <xsl:when test="$defns='&owl;'">owl:</xsl:when>
   <xsl:when test="$defns='&rdfs;'">rdfs:</xsl:when>
   <xsl:when test="$defns='&rdf;'">rdf:</xsl:when>
  </xsl:choose>
 </xsl:variable>

 <xsl:variable name="termchar" select="substring($nsuri-body,string-length($nsuri-body))"/><!-- length of nsuri-body-->
 <xsl:variable name="nsuri"><!--** $nsuri-body + '#' if body is not end with '/' -->
  <!-- <xsl:variable name="nsblen" select="string-length($nsuri-body)"/>length of nsuri-body-->
  <xsl:choose>
   <xsl:when test="$termchar='/'">
    <xsl:choose>
     <xsl:when test="starts-with($classes[1]/@rdf:about,concat($nsuri-body,'#')) or starts-with($properties[1]/@rdf:about,concat($nsuri-body,'#'))">
      <!-- case: http://example.org/ns/# -->
      <xsl:value-of select="concat($nsuri-body,'#')"/>
     </xsl:when>
     <xsl:otherwise>
      <!-- case: http://example.org/ns/ -->
      <xsl:value-of select="$nsuri-body"/>
     </xsl:otherwise>
    </xsl:choose>
   </xsl:when>
   <xsl:when test="$termchar='#'">
    <!-- case: http://example.org/ns# -->
    <xsl:value-of select="$nsuri-body"/>
   </xsl:when>
   <xsl:otherwise>
    <!-- case: http://example.org/ns -->
    <xsl:value-of select="concat($nsuri-body,'#')"/>
   </xsl:otherwise>
  </xsl:choose>
 </xsl:variable>
 <xsl:variable name="localst" select="string-length($nsuri)"/><!--** length of $nsuri -->

 <xsl:variable name="indiv" select="/rdf:RDF/*[not((&class-cond;) or (&prop-cond;) or name(.)='owl:Ontology' or name(.)='ex:Example' or @rdf:about='' or @rdf:about=$nsuri)]"/><!--** all individual elements -->



 <!--========================== Main processing ==========================-->
 <xsl:template match="/">
  <xsl:apply-templates select="rdf:RDF"/>
 </xsl:template>

 <xsl:template match="rdf:RDF">
  <!--** to generate root element and common parts, and call main part -->
  <xsl:variable name="self" select="*[@rdf:about='' or @rdf:about='#' or @rdf:about=$nsuri][*]"/><!--** ontology/schema self description-->
  <html>
   <xsl:if test="@xml:lang"><xsl:attribute name="lang"><xsl:value-of select="@xml:lang"/></xsl:attribute></xsl:if>
   <head>
    <title><xsl:value-of select="$self/dc:title|$self/rdfs:label"/> - XHTML view</title>
    <xsl:call-template name="htmlhead"/>
   </head>
   <body>
    <xsl:call-template name="banner"/>
    <xsl:call-template name="toc"/>
    <xsl:choose>
     <xsl:when test="$self">
      <xsl:apply-templates select="$self" mode="ontelt"/>
     </xsl:when>
     <xsl:otherwise>
      <dl><dt>Namespace</dt><dd><xsl:value-of select="$nsuri"/></dd></dl>
     </xsl:otherwise>
    </xsl:choose>

    <xsl:call-template name="dummy-for-opera"/>
    <xsl:call-template name="generalexamples"/>

    <div class="sec">
     <h2 id="_class_def">Classes</h2>
     <span class="legend">
      <span class="owl Class">owl:Class</span>
      <span class="rdfs Class">rdfs:Class</span>
      <span class="inferred Class">inferred</span>
     </span>
     <xsl:call-template name="cptree">
      <!-- start with classes that are not subClassOf any other class or subClassOf that is not defined here-->
      <xsl:with-param name="l" select="$classes[
       not(rdfs:subClassOf[
         @rdf:resource = /rdf:RDF/*/@rdf:about or 
         substring(@rdf:resource,2) = /rdf:RDF/*/@rdf:ID or
         */@rdf:about = /rdf:RDF/*/@rdf:about or 
         substring(*/@rdf:about,2) = /rdf:RDF/*/@rdf:ID
         ])
       ]"/>
      <!--
      <xsl:with-param name="l" select="$classes[
       not(rdfs:subClassOf) or 
       (rdfs:subClassOf[ not (
         owl:Restriction or
         @rdf:resource = /rdf:RDF/*/@rdf:about or 
         substring(@rdf:resource,2) = /rdf:RDF/*/@rdf:ID or
         */@rdf:about = /rdf:RDF/*/@rdf:about or 
         substring(*/@rdf:about,2) = /rdf:RDF/*/@rdf:ID)
         ])
       ]"/>
       -->
      <xsl:with-param name="nest">0</xsl:with-param>
      <xsl:with-param name="cp">c</xsl:with-param>
     </xsl:call-template>
     <dl id="_class_def_list">
      <xsl:comment>class processing</xsl:comment>
      <xsl:apply-templates select="$classes" mode="pcproc"/>
     </dl>
    </div>
 
    <div class="sec">
     <h2 id="_property_def">Properties</h2>
     <span class="legend">
      <span class="owl ObjectProperty">Object</span>
      <span class="owl DatatypeProperty">Datatype</span>
      <span class="rdf Property">rdf:Prop</span>
      <span class="inferred Property">inferred</span>
     </span>
     <xsl:call-template name="cptree">
      <xsl:with-param name="l" select="$properties[
       not(rdfs:subPropertyOf) or
       (rdfs:subPropertyOf[ not (
         @rdf:resource = /rdf:RDF/*/@rdf:about or 
         substring(@rdf:resource,2) = /rdf:RDF/*/@rdf:ID or
         */@rdf:about = /rdf:RDF/*/@rdf:about or 
         substring(*/@rdf:about,2) = /rdf:RDF/*/@rdf:ID)
         ])
       ]"/>
      <xsl:with-param name="nest">0</xsl:with-param>
      <xsl:with-param name="cp">p</xsl:with-param>
     </xsl:call-template>
     <dl id="_prop_def_list">
      <xsl:comment>property processing</xsl:comment>
      <xsl:apply-templates select="$properties" mode="pcproc"/>
     </dl>
    </div>

    <div class="sec">
     <xsl:call-template name="findmore">
      <xsl:with-param name="l" select="$indiv"/>
     </xsl:call-template>
    </div>

    <xsl:call-template name="footer">
     <xsl:with-param name="status">Status: Schema/Ontology updated <xsl:value-of select="owl:Ontology/dcterms:modified"/>. <!--XSLT modified <xsl:value-of select="$_doas/doas:release/doas:created"/>.--> Stylesheet copyleft under GPL.</xsl:with-param>
    </xsl:call-template>
   </body>
  </html>
 </xsl:template>

 <!--========================== Ontology info processing ==========================-->
 
 <xsl:template match="*" mode="ontelt">
 <!--** Description of this ontoloty/schema itself  -->
  <hgroup>
  <h1><xsl:value-of select="rdfs:label|dc:title|dcterms:title|@dc:title"/></h1>
  </hgroup>
  <div class="abstract" id="_descr">
   <xsl:comment>ontology description</xsl:comment><!--to avoid empty element-->
   <xsl:apply-templates select="rdfs:comment|dc:description|dcterms:description|@rdfs:comment|@dc:description" mode="ontdesc"/>
  </div>
  <script type="text/javascript">
  var desc = document.getElementById('_descr');
  desc.innerHTML= desc.innerHTML.replace(/\n/g,"<br/>");
  var pp=desc.getElementsByTagName('p');
  for(var i=0; i&lt;desc.length;i++){
    pp[i].innerHTML = pp[i].innerHTML.replace(/\n/g,"<br/>");
  }
  </script>
  <dl>
   <dt>Namespace</dt>
   <dd><xsl:value-of select="$nsuri"/></dd>
   <xsl:apply-templates select="*[not(contains('|comment|description|label|title|',local-name()))]" mode="ontdesc"/>
<!--
   <xsl:apply-templates select="ont:created|dcterms:created" mode="ontdesc"/>
   <xsl:apply-templates select="ont:modified|dcterms:modified" mode="ontdesc"/>
   <xsl:apply-templates select="dc:date"/>
   <xsl:apply-templates select="ont:creator|foaf:maker|dc:creator" mode="ontdesc"/>
   <xsl:apply-templates select="owl:versionInfo" mode="ontdesc"/>
   <xsl:apply-templates select="owl:priorVersion" mode="ontdesc"/>
   <xsl:apply-templates select="ont:source|dc:source" mode="ontdesc"/>
   <xsl:apply-templates select="ont:relation|dc:relation" mode="ontdesc"/>
-->
   <xsl:if test="$xmlfile != ''">
    <dt>Ontology document</dt>
    <dd><a href="{$xmlfile}"><xsl:value-of select="$xmlfile"/></a></dd>
   </xsl:if>
  </dl>
 </xsl:template>

 <xsl:template match="*" mode="ontdesc">
 <!--** Annotation properties in ontology/schema description  -->
  <dt title="{name()}"><xsl:value-of select="local-name()"/></dt>
  <dd><xsl:value-of select="."/></dd>
 </xsl:template>

 <xsl:template match="*[@rdf:resource]" mode="ontdesc">
 <!--** source, relation be put hyper link  -->
  <dt title="{name()}"><xsl:value-of select="local-name()"/></dt>
  <dd>
   <a href="{@rdf:resource}">
    <xsl:call-template name="find-label"/>
   </a>
   <xsl:apply-templates select="@dc:format"/>
  </dd>
 </xsl:template>

 <xsl:template match="ont:creator|foaf:maker|dc:creator" mode="ontdesc">
 <!--** maker (author) of the ontology/schema -->
  <dt>author</dt>
  <dd>
   <xsl:choose>
    <xsl:when test=".//foaf:homepage">
     <a href="{.//foaf:homepage/@rdf:resource}"><xsl:call-template name="author-name"/></a>
    </xsl:when>
    <xsl:when test=".//rdfs:seeAlso">
     <a href="{.//rdfs:seeAlso/@rdf:resource}"><xsl:call-template name="author-name"/></a>
    </xsl:when>
    <xsl:otherwise>
     <xsl:call-template name="author-name"/>
    </xsl:otherwise>
   </xsl:choose>
   <xsl:if test=".//foaf:mbox">
    (
    <xsl:choose>
     <xsl:when test="starts-with(.//foaf:mbox/@rdf:resource,'mailto:webmaster@kanzaki')">
      <a href="/info/disclaimer#webmastermail">See contact information</a>
     </xsl:when>
     <xsl:otherwise>
      <a href=".//foaf:mbox/@rdf:resource"><xsl:value-of select=".//foaf:mbox/@rdf:resource"/></a>
     </xsl:otherwise>
    </xsl:choose>
    )
   </xsl:if>
  </dd>
 </xsl:template>

 <xsl:template name="author-name">
  <xsl:choose>
   <xsl:when test=".//foaf:name">
    <xsl:value-of select=".//foaf:name[1]"/>
    <xsl:if test=".//foaf:name[2]">
    (<xsl:value-of select=".//foaf:name[2]"/>)
   </xsl:if>
   </xsl:when>
   <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
  </xsl:choose>
 </xsl:template>

 <xsl:template match="dc:description|rdfs:comment|@rdfs:comment|@dc:description" mode="ontdesc">
 <!--** Ontology/Schema description property -->
  <p>
   <xsl:if test="@xml:lang='ja'"><img src="images/kanzaki/ja.png" alt="[ja]"/></xsl:if>
   <xsl:value-of select="normalize-space(.)"/>
  </p>
 </xsl:template>

 <xsl:template match="*[@rdf:parseType='Literal']" mode="ontdesc">
 <!--** show as literal XML -->
  <div>
   <xsl:copy-of select="."/>
  </div>
 </xsl:template>

 <!--========================== Common handling ==========================-->

 <xsl:template match="*">
 <!--** Catch all - general properties handler: displays element name and values as dt/dd, and apply templates for children -->
  <dt>
   <xsl:value-of select="name()"/>
   <xsl:if test="@xml:lang">
    (@<xsl:value-of select="@xml:lang"/>)
   </xsl:if>
  </dt>
  <dd>
   <xsl:choose>
    <xsl:when test="@rdf:parseType='Literal'">
     <xsl:copy-of select="."/>
    </xsl:when>
    <xsl:when test="*|@*[name!='xml:lang']">
     <dl>
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates select="*"/>
     </dl>
    </xsl:when>
    <xsl:otherwise>
     <xsl:value-of select="."/>
    </xsl:otherwise>
   </xsl:choose>
  </dd>
 </xsl:template>

 <xsl:template match="@*">
 <!--** Displays attribute name and values as dt/dd-->
  <dt><xsl:value-of select="name()"/></dt>
  <dd><xsl:value-of select="."/></dd>
 </xsl:template>

 <xsl:template match="@rdf:parseType">
 <!--** ignore parseType-->
 </xsl:template>


 <xsl:template match="@xml:lang">
 <!--** xml:lang is displayed with element name as (@en) etc.  -->
 </xsl:template>

 <xsl:template match="*[@rdf:resource or @rdf:about]">
 <!--** If the element has URI ref (rdf:about/rdf:resource), display QName as <dt>, and reference as <dd> by calling href-dispname -->
  <dt><xsl:value-of select="name()"/></dt>
  <dd>
   <xsl:call-template name="href-dispname">
    <xsl:with-param name="id"><xsl:call-template name="idabout"/></xsl:with-param>
    <xsl:with-param name="hash" select="'#'"/>
   </xsl:call-template>
  </dd>
 </xsl:template>

 <xsl:template match="rdfs:*[@rdf:resource or @rdf:about]" priority="1.0">
 <!--** RDFS element with URI ref (rdf:about/rdf:resource), display local name as <dt>, and reference as <dd> by calling href-dispname -->
  <dt><xsl:value-of select="local-name()"/></dt>
  <dd>
   <xsl:call-template name="href-dispname">
    <xsl:with-param name="id"><xsl:call-template name="idabout"/></xsl:with-param>
    <xsl:with-param name="hash" select="'#'"/>
   </xsl:call-template>
  </dd>
 </xsl:template>


 <!--========================== Class/Property processing ==========================-->
 
 <xsl:template match="rdf:RDF/*[&class-cond; or &prop-cond;]" mode="pcproc">
 <!--** main temlate: Class and Property definition. Steps:  -->
  <xsl:if test="starts-with(preceding-sibling::node()[2],'****')">
   <dt class="group"><xsl:value-of select="normalize-space(translate(preceding-sibling::node()[2],'*',''))"/></dt>
  </xsl:if>
  <!--@ get id/about of the term as $id, by calling idabout -->
  <xsl:variable name="id">
   <xsl:call-template name="idabout"/>
  </xsl:variable>
  <!--@ generates <dt> of the definition by calling elt-dt -->
  <dt>
   <xsl:call-template name="elt-dt">
    <xsl:with-param name="id" select="$id"/>
   </xsl:call-template>
  </dt>
  <!--@ generates <dd> of the definition and shows attributes of definition as sub <dl> -->
  <dd>
   <dl>
    <!--@ _ rdfs:comment of the term -->
    <xsl:comment><xsl:value-of select="local-name()"/></xsl:comment><!-- to avoid empty <dl/> -->
    <!--@ _ apply templates for children other than id/about or label or type -->
    <xsl:apply-templates select="@*[not(name()='rdf:about' or name()='rdf:ID' or name()='rdfs:label')]"/>
    <xsl:apply-templates select="*[not(name()='rdfs:label' or name()='rdf:type')]"/>
    <!--@ _ check if in domain/range of any property by calling domain-range -->
    <xsl:call-template name="domain-range">
     <xsl:with-param name="nodes" select="$properties[rdfs:domain/@rdf:resource=concat('#',$id) or rdfs:domain/@rdf:resource=concat($nsuri,$id)]"/>
     <xsl:with-param name="type" select="'domain'"/>
    </xsl:call-template>
    <xsl:call-template name="domain-range">
     <xsl:with-param name="nodes" select="$properties[rdfs:range/@rdf:resource=concat('#',$id) or rdfs:range/@rdf:resource=concat($nsuri,$id)]"/>
     <xsl:with-param name="type" select="'range'"/>
    </xsl:call-template>
   </dl>
  </dd>
 </xsl:template>

 <xsl:template name="domain-range">
 <!--** finds if a class is in-domain-of or in-range-of any property -->
  <xsl:param name="nodes"/>
  <xsl:param name="type"/>
  <xsl:if test="$nodes != ''">
   <dt>in <xsl:value-of select="$type"/> of</dt>
   <dd>
    <xsl:for-each select="$nodes">
     <xsl:call-template name="href-dispname">
      <xsl:with-param name="id"><xsl:call-template name="idabout"/></xsl:with-param>
      <xsl:with-param name="hash" select="'#'"/>
     </xsl:call-template>
     ; 
    </xsl:for-each>
   </dd>
  </xsl:if>
 </xsl:template>

 <xsl:template match="rdfs:domain[@rdf:resource]|rdfs:range[@rdf:resource]|rdfs:subClassOf[@rdf:resource]|rdfs:subPropertyOf[@rdf:resource]" priority="2.0">
 <!--** domain, range, subClassOf, subPropertyOf treated specially  -->
  <dt class="essential" title="{name()}"><xsl:value-of select="local-name()"/></dt>
  <dd class="essential">
   <xsl:call-template name="href-dispname">
    <xsl:with-param name="id"><xsl:call-template name="idabout"/></xsl:with-param>
    <xsl:with-param name="hash" select="'#'"/>
   </xsl:call-template>
  </dd>
 </xsl:template>

 <xsl:template match="rdfs:seeAlso[@rdf:resource or */@rdf:about]|ont:relation" priority="2.0">
 <!--** more info  -->
  <dt title="{name()}"><xsl:value-of select="local-name()"/></dt>
  <dd>
   <a href="{@rdf:resource|*/@rdf:about}">
    <xsl:call-template name="find-label"/>
   </a>
  </dd>
 </xsl:template>

 <xsl:template match="@dc:format">
  (<xsl:value-of select="."/>)
 </xsl:template>

 <xsl:template match="*/rdfs:label|*/@rdfs:label" mode="heading">
 <!--** Labels of class/property will be shown in a [] blacket for heading. -->
  <span class="label"> [<xsl:value-of select="."/>]</span>
 </xsl:template>
 
 <xsl:template match="*/rdfs:label|*/@rdfs:label">
 <!--** do noting for rdfs:label if not heading mode. -->
 </xsl:template>

 <xsl:template match="ex:example">
 <!--** Show examples provided in a term definition. Note general examples (top level ex:Example) are treated by named template 'generalexamples' -->
  <dt>Example</dt>
  <dd>
   <xsl:if test=".//dc:description"><p><xsl:value-of select=".//dc:description"/></p></xsl:if>
   <div class="example"><pre class="ex {.././@rdf:ID}"><xsl:value-of select=".//ex:code"/></pre></div>
  </dd>
 </xsl:template>


 <!--=========== named templates ============-->

 <xsl:template name="toc">
 <!--** head table of contents with number of Classes and /Proprties -->
  <p>
   <xsl:if test="/rdf:RDF/ex:Example"><a href="#_ex_usage">Example</a> (<xsl:value-of select="count(/rdf:RDF/ex:Example)"/>) | </xsl:if>
   <a href="#_class_def">Class</a> (<xsl:value-of select="count($classes)"/>) | 
   <a href="#_property_def">Property</a> (<xsl:value-of select="count($properties)"/>)
   <xsl:if test="$indiv"> | <a href="#_individual_def">Individuals</a> (<xsl:value-of select="count($indiv)"/>)</xsl:if>
  </p>
  <p id="ie-notice">This is an XHTML presentation of an RDF/XML file via XSLT. Internet Explorer user might not be able to view source, but still can save the RDF from file menu. </p>
  <script type="text/javascript">//<![CDATA[
if(navigator.userAgent.indexOf('MSIE') != -1) document.getElementById('ie-notice').style.display = 'block';
  //]]></script>
 </xsl:template>

 <xsl:template name="find-label">
 <!--** finds label of a term from rdfs:label, dc:title or just its uri -->
  <xsl:choose>
   <xsl:when test="@rdfs:label or @dc:title">
    <xsl:value-of select="@rdfs:label|@dc:title"/>
   </xsl:when>
   <xsl:otherwise>
    <xsl:value-of select="@rdf:resource"/>
   </xsl:otherwise>
  </xsl:choose>
 </xsl:template>

 <xsl:template name="namespace">
 <!--** displays namespace information -->
  <dt>Namespace</dt>
  <dd>
   <xsl:choose>
    <xsl:when test="@xml:base"><xsl:value-of select="@xml:base"/>#</xsl:when>
    <xsl:when test="$xmlfile"><xsl:value-of select="$xmlfile"/># (guess from source)</xsl:when>
    <xsl:otherwise>unknown</xsl:otherwise>
   </xsl:choose>
  </dd>
 </xsl:template>

 <xsl:template name="dummy-for-opera">
  <!--Opera cannot process a template after xsl:choose ??? it ignores generalexample if without this dummy template -->
 </xsl:template>

 <xsl:template name="generalexamples">
 <!--** generates example sections from top level ex:Example. Note examples in term definition will be treated by match template. -->
  <xsl:variable name="ex" select="./*[local-name()='Example']"/>
  <xsl:variable name="exc" select="count($ex)"/>
  <xsl:if test="$ex">
   <div class="sec">
    <h2 id="_ex_usage">Example<xsl:if test="$exc &gt; 1">s</xsl:if></h2>
    <xsl:for-each select="$ex">
     <xsl:if test="$exc &gt; 1"><h3>Example <xsl:value-of select="position()"/></h3></xsl:if>
     <!--@ description of this example -->
     <p><xsl:value-of select="rdfs:comment|dc:description"/></p>
     <p><img src="images/kanzaki/ja.png" alt="[ja]"/> <xsl:value-of select="rdfs:comment[@xml:lang='ja']|dc:description[@xml:lang='ja']"/>
     <xsl:apply-templates select="ex:pfx"/></p>
     
     <!--@ link to trial example (e.g. web app) -->
     <xsl:if test="ex:trial">
      <p>Try example(s) at <a href="{ex:trial/@rdf:resource}"><xsl:value-of select="ex:trial/@rdf:resource"/></a> .</p>
     </xsl:if>
     <!--@ h:img comes before code example -->
     <xsl:if test="h:img">
      <p><img src="{h:img/@rdf:resource}"/></p>
     </xsl:if>
     <!--@ code example -->
     <div class="example"><pre class="{ex:pfx}"><xsl:value-of select="ex:code"/></pre></div>
     <!--@ link to related documents -->
     <xsl:if test="ont:relation">
      <p>related resouce(s):
      <xsl:for-each select="ont:relation">
       <a href="{@rdf:resource}"><xsl:value-of select="@rdfs:label|rdfs:label"/></a>; 
      </xsl:for-each>
      </p>
     </xsl:if>
     <!--@ ex:image comes after code example -->
     <xsl:if test="ex:image">
      <p>
       <xsl:choose>
        <xsl:when test="ex:image/foaf:Image">
         See <a href="{ex:image/foaf:Image/@rdf:about}"><xsl:value-of select="ex:image/foaf:Image/@rdfs:label"/></a>.
        </xsl:when>
        <xsl:otherwise><img src="{ex:image/@rdf:resource}"/></xsl:otherwise>
       </xsl:choose>
      </p>
     </xsl:if>
    </xsl:for-each>
   </div>
  </xsl:if>
 </xsl:template>

 <!-- for example prefix -->
 <xsl:template match="ex:pfx">
  <br/>(Note: vocabulary of this schema represented with prefix <strong><xsl:value-of select="."/></strong>)
 </xsl:template>


 <xsl:template name="topnode">
 <!--** TEST for root of class/propety tree that is just referred by @rdf:resource. Steps: -->
  <xsl:param name="l"/><!--** list of subClassOf/subPropertyOf nodes -->
  <xsl:param name="cp"/><!--** whether class or property -->
  <ul>
   <xsl:for-each select="$l">
    <xsl:sort select="@rdf:resource"/>
    <xsl:variable name="p" select="position()"/>
<!--
    <xsl:value-of select="$p"/>:<xsl:value-of select="$l[$p]/@rdf:resource"/> (<xsl:value-of select="$p+1"/>):<xsl:value-of select="$l[$p+1]/@rdf:resource"/><br/>
-->
    <xsl:if test="$l[$p]/@rdf:resource != $l[$p+1]/@rdf:resource">
     <!--＠＠ソートして、次のノードとの比較で同じでなければ処理することで重複を回避できると思ったが、うまくいかない。$pはソート後のコンテキスト位置だが、$l自身の順序は元のままなので、これではソートしていないのと同じこと。ソート後の順序で「次」のノードにアクセスする方法はないものか-->
     <xsl:variable name="r" select="$l[$p]/@rdf:resource"/>
     <li>
      <xsl:value-of select="$r"/>
      <xsl:choose>
       <xsl:when test="$cp='c'">
        <xsl:call-template name="cptree">
         <xsl:with-param name="l" select="$classes[rdfs:subClassOf/@rdf:resource=$r]"/>
         <xsl:with-param name="nest" select="1"/>
         <xsl:with-param name="cp" select="$cp"/>
        </xsl:call-template>
       </xsl:when>
       <xsl:otherwise>
        <xsl:call-template name="cptree">
         <xsl:with-param name="l" select="$properties[rdfs:subPropertyOf/@rdf:resource=$r]"/>
         <xsl:with-param name="nest" select="1"/>
         <xsl:with-param name="cp" select="$cp"/>
        </xsl:call-template>
       </xsl:otherwise>
      </xsl:choose>
     </li>
    </xsl:if>
   </xsl:for-each>
  </ul>

 </xsl:template>

 <xsl:template name="cptree">
 <!--** displays Classes/Proprties as a tree with links to their definitions. Starts with those that (1)do not have any subClassOf/subPropertyOf construct with @rdf:ersource or (2)have subClassOf/subPropertyOf whose object is not defined in top level (i.e. external). Steps: -->
  <xsl:param name="l"/><!--** list of classes/properties -->
  <xsl:param name="nest"/><!--** nest level to avoid infinit loop -->
  <xsl:param name="cp"/><!--** whether class or property -->
  <xsl:if test="count($l)">
  <!--@ If $l has any class or property, then generate <ul> list.-->
   <ul>
    <xsl:for-each select="$l">
    <!--@ For each member of the list as <li>, -->
     <xsl:choose>
      <xsl:when test="not(starts-with(local-name(),'Deprecate'))">
      <!--<xsl:sort select="@rdf:resource"/>@rdf:resourceだけで上位を参照しているものの整理が必要＠＠＠＠-->
       <xsl:variable name="id">
        <xsl:call-template name="idabout"/>
       </xsl:variable>
       <li>
        <!--@ _ determine the link target from ID or about, and set hyperlink to the class/property description in this presentation, by calling href-dispname -->
        <xsl:call-template name="href-dispname">
         <xsl:with-param name="id" select="$id"/>
        </xsl:call-template>

        <!--@ _ call this template recursively with parameter of list of classes/properties that are subClassOf/subPropertyOf this item, provided the nest level is within the limit-->
        <xsl:variable name="myrefid">
         <xsl:choose>
          <xsl:when test="substring($id,1,1)='!'"><xsl:value-of select="substring($id,2)"/></xsl:when>
          <xsl:otherwise>#<xsl:value-of select="$id"/></xsl:otherwise>
         </xsl:choose>
        </xsl:variable>
        <xsl:variable name="longrefid" select="concat($nsuri,$id)"/>
        
        <xsl:choose>
         <xsl:when test="$nest &gt; 8"></xsl:when>
         <xsl:when test="$cp='c'">
          <xsl:call-template name="cptree">
           <xsl:with-param name="l" select="$classes[rdfs:subClassOf[
              @rdf:resource=$myrefid or 
              @rdf:resource=$longrefid or
              */@rdf:about=$myrefid or
              */@rdf:about=$longrefid]
            ]"/>
           <xsl:with-param name="nest" select="$nest + 1"/>
           <xsl:with-param name="cp" select="$cp"/>
          </xsl:call-template>
         </xsl:when>
         <xsl:otherwise>
          <xsl:call-template name="cptree">
           <xsl:with-param name="l" select="$properties[rdfs:subPropertyOf[
              @rdf:resource=$myrefid or 
              @rdf:resource=$longrefid or
              */@rdf:about=$myrefid or
              */@rdf:about=$longrefid]
            ]"/>
           <xsl:with-param name="nest" select="$nest + 1"/>
           <xsl:with-param name="cp" select="$cp"/>
          </xsl:call-template>
         </xsl:otherwise>
        </xsl:choose>
       </li>
      </xsl:when>
      <xsl:otherwise>
       <xsl:comment><xsl:value-of select="local-name()"/></xsl:comment><!-- avoid blank ul -->
      </xsl:otherwise>
     </xsl:choose><!-- end of if not deprecate-->
    </xsl:for-each>
   </ul>
  </xsl:if>
 </xsl:template>



 <xsl:template name="findmore">
 <!--** find and listup definitions with unexpected sytax or individuals -->
  <xsl:param name="l"/>
  <xsl:if test="$l">
   <h2 id="_individual_def">Other Descriptions and Individuals</h2>
   <dl>
    <xsl:for-each select="$l">
     <dt>
      <xsl:call-template name="elt-dt">
       <xsl:with-param name="id"><xsl:call-template name="idabout"/></xsl:with-param>
       <xsl:with-param name="c">more-elt </xsl:with-param>
      </xsl:call-template>
     </dt>
     <dd><dl>
     <!--
      <xsl:if test="not(namespace-uri()='&rdf;' and local-name()='Description')">
       <dt>rdf:type</dt><dd class="rdftype"><xsl:value-of select="name()"/></dd>
      </xsl:if>
      -->
      <xsl:apply-templates select="@*[not(name()='rdf:ID' or name()='rdf:about')]|*"/>
     </dl></dd>
   </xsl:for-each>
   </dl>
  </xsl:if>
 </xsl:template>

 <xsl:template name="idabout">
  <!--** assign name with local/outer information. Steps: -->
  <xsl:choose>
   <!--@ if @rdf:ID presents, use it -->
   <xsl:when test="@rdf:ID">
    <xsl:value-of select="@rdf:ID"/>
   </xsl:when>

   <!--@ else if @rdf:about or @rdf:resource presents, switch: -->
   <xsl:when test="@rdf:about or @rdf:resource">
    <xsl:variable name="ref" select="@rdf:about|@rdf:resource"/>
    <xsl:choose>
     <!--@ _case: blank uri = self -->
     <xsl:when test="$ref=''">(self)</xsl:when>
     <!--@ _case: starts-with '#' = local vocab. trim '#' and return local name only -->
     <xsl:when test="starts-with($ref,'#')">
      <xsl:value-of select="substring($ref,2)"/>
     </xsl:when>
     <!--@ _case: outside uri or nsuri itself = add ! before uri as a mark -->
     <xsl:when test="not(contains($ref,$nsuri)) or $ref=$nsuri">
      <xsl:value-of select="concat('!',$ref)"/>
     </xsl:when>
<!--
     <xsl:when test="contains($ref,'#')">
      <xsl:value-of select="substring-after($ref,'#')"/>
     </xsl:when>
-->
     <!--@ _otherwise: local vocab. return local name (after nsuri) -->
     <xsl:otherwise>
      <xsl:value-of select="substring($ref,$localst + 1)"/>
     </xsl:otherwise>
    </xsl:choose>
   </xsl:when>

   <!--@ else if @rdf:nodeID presents, use it with bnode prefix '_:' before nodeID -->
   <xsl:when test="@rdf:nodeID">
    <xsl:value-of select="concat('_:',@rdf:nodeID)"/>)
   </xsl:when>

   <!--@ otherwise, return string (anonymous) -->
   <xsl:otherwise>(anonymous)</xsl:otherwise>
  </xsl:choose>

 </xsl:template>

 <xsl:template name="elt-dt">
 <!--** determines class and id of the node for <dt> element. Steps: -->
  <xsl:param name="id"/>
  <xsl:param name="c"/>
  <!--@ test for the type (asserted Class, inferred Property etc. -->
  <xsl:variable name="class">
   <xsl:value-of select="$c"/>
   <xsl:value-of select="translate(name(),':',' ')"/>
   <xsl:if test="rdf:type">
    <xsl:variable name="tns" select="concat(substring-before(rdf:type/@rdf:resource,'#'),'#')"/>
    <xsl:if test="$tns='&owl;'"> owl</xsl:if>
    <xsl:if test="$tns='&rdfs;'"> rdfs</xsl:if>
    <xsl:value-of select="concat(' ',substring-after(rdf:type/@rdf:resource,'#'))"/>
   </xsl:if>
   <xsl:if test="(&inferred-class;) and not(&asserted-class;)"> inferred Class</xsl:if>
   <xsl:if test="(&inferred-prop;) and not(&asserted-prop;)"> inferred Property</xsl:if>
   <xsl:if test="not(@rdf:ID) and not(starts-with(@rdf:about,$nsuri)) and not(starts-with(@rdf:about,'#'))">
    <xsl:text> outer</xsl:text>
   </xsl:if>
  </xsl:variable>
  <xsl:variable name="errorclass">
   <!-- because IE doesn't recognize selector like td.Class.Property-->
   <xsl:if test="contains($class,'Class') and contains($class,'Property')"> error</xsl:if>
  </xsl:variable>

  <!--@ and assign the tyep as @class attribute. -->
  <xsl:attribute name="class"><xsl:value-of select="concat($class,$errorclass)"/></xsl:attribute>
  <!--@ set @id attribute and display name by calling id-dispname. -->
  <xsl:call-template name="id-dispname">
   <xsl:with-param name="id" select="$id"/>
  </xsl:call-template>

  <!--@ assign label -->
  <xsl:apply-templates select="rdfs:label|@rdfs:label" mode="heading"/>
  <!--@ show icon if status is testing or unstable -->
  <xsl:if test="vs:term_status or @vs:term_status">
   <xsl:choose>
    <xsl:when test="vs:term_status='testing' or @vs:term_status='testing'">
     <img class="term_status" src="images/kanzaki/construction.gif" alt="testing term"/>
    </xsl:when>
    <xsl:when test="vs:term_status='unstable' or @vs:term_status='unstable'">
     <img class="term_status" src="images/kanzaki/watchout.gif" alt="unstable term"/>
    </xsl:when>
    <xsl:when test="vs:term_status='deprecated' or @vs:term_status='deprecated'">
     <img class="term_status" src="images/kanzaki/deprecated.gif" alt="deprecated term"/>
    </xsl:when>
   </xsl:choose>
  </xsl:if>
  <!--@ and show class/property type -->
  <xsl:variable name="tpfx">
   <xsl:choose>
    <xsl:when test="contains($class,'inferred Class')">rdfs:</xsl:when>
    <xsl:when test="contains($class,'inferred Property')">rdf:</xsl:when>
    <xsl:when test="contains($class,'owl')">owl:</xsl:when>
    <xsl:when test="contains($class,'rdfs')">rdfs:</xsl:when>
    <xsl:when test="contains($class,'rdf')">rdf:</xsl:when>
    <xsl:when test="$defnspfx != ''"><xsl:value-of select="$defnspfx"/></xsl:when><!--(Note namespace:: does not work in Mozilla)-->
   </xsl:choose>
  </xsl:variable>
  <span class="cp-type">
   <xsl:choose>
  <!--@ _ alert if the term is both Class and Property (inferred) -->
    <xsl:when test="contains($class,'Class') and contains($class,'Property')">
     <!-- inconsistent Class/Property -->
     <span class="error">Class as well as Property ?</span>
    </xsl:when>
    <xsl:when test="name()='Class' or name()='Property'">
     <!-- default ns Class/Property -->
     <xsl:value-of select="concat($tpfx,name())"/>
    </xsl:when>
    <xsl:when test="contains(name(),'Class') or contains(name(),'Property')">
     <!-- explicit ns Class/Property -->
     <xsl:value-of select="name()"/>
    </xsl:when>
    <xsl:when test="contains($class,'inferred')">
     <!-- inferred Class/Property -->
     <span class="inferred"> 
     <xsl:choose>
      <xsl:when test="contains($class,'Class')"><xsl:value-of select="$tpfx"/>Class</xsl:when>
      <xsl:otherwise>rdf:Property</xsl:otherwise>
     </xsl:choose>
     </span>
    </xsl:when>
    <xsl:when test="contains($class,'Class')"><xsl:value-of select="$tpfx"/>Class</xsl:when>
    <xsl:when test="contains($class,'Property')"><xsl:value-of select="$tpfx"/>Property</xsl:when>
    <xsl:otherwise><xsl:value-of select="name()"/></xsl:otherwise>
   </xsl:choose>
   <xsl:call-template name="owltypes"/>
  </span>
 </xsl:template>

 <xsl:template name="id-dispname">
  <!--** gives id attribute and display name. Steps: -->
  <xsl:param name="id"/>
    
  <!--@ generate id attribute by calling idhref-attr (attr='id'). -->
  <xsl:call-template name="idhref-attr">
   <xsl:with-param name="id" select="$id"/>
   <xsl:with-param name="attr" select="'id'"/>
  </xsl:call-template>

  <!--@ and give the name of the term, by calling idhref-term. -->
  <xsl:call-template name="idhref-term">
   <xsl:with-param name="id" select="$id"/>
  </xsl:call-template>
 </xsl:template>

 <xsl:template name="href-dispname">
  <!--** gives href attribute and display name. Staps: -->
  <xsl:param name="id"/>
  <xsl:param name="hash"/>
  <!--xsl:value-of select="concat('{',$id,'}')"/-->
  <xsl:choose>
   <!--@ if $id starts with '!' or '(', outer reference. Just present uri (no link)-->
   <xsl:when test="starts-with($id,'!') or starts-with($id,'(')">
    <xsl:call-template name="idhref-term">
     <xsl:with-param name="id" select="$id"/>
    </xsl:call-template>
   </xsl:when>
   <!--@ else it is local term. -->
   <xsl:otherwise>
    <!--@ _ create a link to local term definition, by calling idhref-attr (attr='href'). -->
    <a>
     <xsl:call-template name="idhref-attr">
      <xsl:with-param name="id" select="$id"/>
      <xsl:with-param name="attr" select="'href'"/>
      <xsl:with-param name="hash" select="'#'"/>
     </xsl:call-template>
<!--
     <xsl:if test="starts-with($id,'!')">
      <xsl:attribute name="class">outer</xsl:attribute>
     </xsl:if>
-->
     <!--@ _ and the name of the term (with $hash before it), by calling idhref-term. -->
     <xsl:call-template name="idhref-term">
      <xsl:with-param name="id" select="$id"/>
      <xsl:with-param name="hash" select="$hash"/>
     </xsl:call-template>
    </a>
   </xsl:otherwise>
  </xsl:choose>
 </xsl:template>

 <xsl:template name="idhref-attr">
  <!--** generates id or href attribute. Steps: -->
  <xsl:param name="id"/>
  <xsl:param name="attr"/>
  <xsl:param name="hash"/>
  
  <!--@geneates attribute, according to param 'attr', and switch:-->
  <xsl:attribute name="{$attr}">
   <xsl:choose>
    <!--@ _case: starts-with '!' or '(' = not local name, so assing id by generate-id()-->
    <xsl:when test="starts-with($id,'!') or starts-with($id,'(')">
     <xsl:value-of select="concat($hash,generate-id(.))"/>
    </xsl:when>
    <!--@ _case: starts-with '_:' = blank node. use nodeID as html id -->
    <xsl:when test="starts-with($id,'_:')">
     <xsl:value-of select="concat($hash,substring($id,3))"/>
    </xsl:when>
    <!--@ _otherwise: use id as html id -->
    <xsl:otherwise>
     <xsl:value-of select="concat($hash,$id)"/>
    </xsl:otherwise>
   </xsl:choose>
  </xsl:attribute>

 </xsl:template>

 <xsl:template name="idhref-term">
  <!--** give a display label to a term based on its id. Steps: -->
  <xsl:param name="id"/>
  <xsl:param name="hash"/>
  <!--@switch:-->
  <xsl:choose>
   <!--@ _case: starts-with '!' = not local name, so just use whole uri as label-->
   <xsl:when test="substring($id,1,1)='!'">
    <xsl:value-of select="substring($id,2)"/>
   </xsl:when>
   <!--@ _case: (self) = document itself, so use $nsuri as label-->
   <xsl:when test="$id='(self)'">
    <xsl:value-of select="$nsuri"/>
   </xsl:when>
   <!--@ otherwise: local name, so use ($hash +) $id as label-->
   <xsl:otherwise>
    <xsl:value-of select="concat($hash,$id)"/>
   </xsl:otherwise>
  </xsl:choose>
 </xsl:template>

 <xsl:template name="owltypes">
  <!--** find if any of the term's rdf:types comes from owl: namespace -->
  <xsl:for-each select="./rdf:type/@rdf:resource">
   <xsl:if test="contains(.,'&owl;')">
    <xsl:value-of select="concat(', owl:', substring-after(.,'#'))"/>
   </xsl:if>
  </xsl:for-each>
 </xsl:template>

 <xsl:template name="htmlhead">
 <!--** Generates some XHTML head elements, especially style sheet and javascript -->
  <link rel="stylesheet" href="stylesheets/assets/kan01.css" type="text/css" />
  <xsl:if test="/rdf:RDF/ex:Example"><link rel="bookmark" href="#_ex_usage" /></xsl:if>
  <xsl:if test="$classes"><link rel="bookmark" href="#_class_def" /></xsl:if>
  <xsl:if test="$properties"><link rel="bookmark" href="#_property_def" /></xsl:if>
  <xsl:if test="$indiv"><link rel="bookmark" href="#_individual_def" /></xsl:if>
  <style type="text/css">/*<![CDATA[*/
.Class, .Property, .DatatypeProperty, .ObjectProperty, .AnnotationProperty, .FunctionalProperty, .InverseFunctionalProperty, .more-elt,.DeprecatedClass, .DepricatedProperty {padding:0.4em; width:100%; border-width: 1px; border-style: dashed; position:relative; margin-top: 1.5em}

/* solid border=owl names, dashed border: rdf(s) names */
.rdfs, .rdf {border-style:dashed}
.owl {border-style:solid}

.Class {background:#fee; border-color: maroon}
.Property, .DatatypeProperty, .AnnotationProperty {background:#eef; border-color: navy}
.ObjectProperty, /*.FunctionalProperty,*/ .InverseFunctionalProperty {background:#cdf; border-color: navy; border:#33c 1px solid}
.DeprecatedClass, .DeprecatedProperty {color: gray; border:none; background:#eee}

.more-elt {background:#eee; border-color: green; border-style: solid}
    /*.DatatypeProperty {border:#88f 1px solid}*/

dt.inferred, .legend span.inferred {/*border-color:silver;*/background-color:white}
/*dt.Class.Property*/ dt.error {border: red 2px solid}
span.inferred {color: gray}
.label {font-weight: normal; color: #555}
.cp-type {font-weight: normal; font-size:90%; color: maroon; position:absolute; right:20px}
.outer .cp-type {color: gray}
dd dt {font-weight: normal; color: #060}
dt.essential {font-weight:bold}
dd.rdftype {color:maroon}
.abstract {border: dotted 1px gray; padding: 0 1em}
.abstract p {line-height: 1.4}
pre b {color:#b00; font-weight:normal}
pre .comment {color:#3a3}
dt.outer {border:none; color:gray; font-weight:normal}
a.outer {color: #66a}
img.term_status {position:absolute; right:1px}
/*dd.dr {color:#00c}*/
#ie-notice {background: #efe; padding: 0.5em; display:none}
div.sec {border-top: silver 1px dashed; margin-top: 3em}
div.sec h2 {margin-top: 1em; font-size:1.75em}
p {line-height: 1.3}
dt.group {font-size:1.6em; color: navy; margin-top:1.5em}
span.legend {font-size:0.7em; float:right; line-height:1; } span.legend span {display:block; float:left; margin:2px; width:4em; height:1em}
/*   ]]>*/</style>
  <script type="text/javascript" src="/assets/js/ns-schema.js">//</script>
 </xsl:template>

 
 <xsl:include href="./banner-footer.xsl"/>

</xsl:stylesheet>
