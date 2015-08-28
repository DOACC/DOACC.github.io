<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/parts/xsltdoc.xsl" type="text/xsl" media="screen"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:doas="http://purl.org/net/ns/doas#"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:h="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="rdf rdfs doas h"
>
 <xsl:output method="html"/>

 <xsl:variable name="xslttitle" select="//rdf:Description[1]/doas:title"/>
 <xsl:variable name="noidchars">/@*:|[]()=</xsl:variable>
 <xsl:variable name="escchars">-_x..</xsl:variable>
 
 <xsl:template name="_doas_description">
  <rdf:RDF xmlns="http://purl.org/net/ns/doas#">
   <rdf:Description rdf:about="">
    <title>XSLT Stylesheet description stylesheet</title>
    <description>This stylesheet analyses an XSLT and generates a document description and template descriptions. Comments inside xsl:template element (after open tag) and begins with '**' are regarded as the template descriptions. A special template named '_doas_description' will contain an RDF (fragment) to describe the XSLT document.</description>
    <author rdf:parseType="Resource">
     <name>Masahide Kanzaki</name>
     <homepage rdf:resource="http://www.kanzaki.com/"/>
    </author>
    <created>2005-07-19</created>
    <release rdf:parseType="Resource">
     <revision>0.63</revision>
     <created>2008-07-15</created>
    </release>
    <rights>(c) 2005-2008 by the author, copyleft under LGPL</rights>
    <license rdf:resource="http://creativecommons.org/licenses/LGPL/2.1/"/>
    <acknowledgement>Some suggestions from J. Meyknecht, J. L. Clark and inputs from F. Bancharel</acknowledgement>
   </rdf:Description>
  </rdf:RDF>
 </xsl:template>

 <!--=========================== Document level processing ===========================-->
 <xsl:template match="/">
  <!--** Triggers template. Sets a simple CSS style, prepares title and call template to proc xsl:stylesheet. -->
  <html lang="en">
   <head>
    <title>XSLT Documentation: <xsl:value-of select="$xslttitle"/></title>
    <link rel="stylesheet" type="text/css" href="/parts/kan01.css"/>
    <style type="text/css">h3.group {border-top: gray dashed 1px; padding-top: 0.7em} h4 {background:#eef; padding:0.2em; font-size:1.2em} .pattern {color:maroon} .template-desc {margin-left: 1em} .template-desc ul, .template-desc ol {margin-top:0.3em} li .comnt, .abstract {color:green} .item {background:#eee;margin:0.3em 0;width:12em; padding:0.1em} .docdescr {border: dotted 1px gray; padding: 1em; color:black; line-height: 1.4} code.mode {font-size:0.8em; font-style:normal; color: navy}</style>
   </head>
   <body>
    <xsl:call-template name="banner"/>
    <xsl:apply-templates select="xsl:stylesheet|xsl:transform"/>
    <xsl:call-template name="footer">
     <xsl:with-param name="cy">2005</xsl:with-param>
    </xsl:call-template>
   </body>
  </html>
 </xsl:template>


 <xsl:template match="xsl:stylesheet|xsl:transform">
  <!--** Main part of stylesheet description. Steps:-->
  <h1>
   <xsl:choose>
    <xsl:when test="$xslttitle"><xsl:value-of select="$xslttitle"/></xsl:when>
    <xsl:otherwise>XSLT Description</xsl:otherwise>
   </xsl:choose>
  </h1>
  <p>(This is an automatically generated XSLT stylesheet description, based on its template calls, parameters, variables and annotating comments.)</p>
  <!--@ stylesheet metadata if an rdf:Description presents -->
  <xsl:apply-templates select="xsl:template[@name='_doas_description']//rdf:Description"/>

  <!--@ general stylesheet settings e.g. external resources, output options and globals -->
  <xsl:call-template name="style-global"/>
  
  <h2>Template descriptions</h2>

  <!--@ description of each template -->
  <xsl:apply-templates select="xsl:template[not(@name='_doas_description')]|comment()"/>
 </xsl:template>


 <!--=========================== Node level processing ===========================-->

 <xsl:template match="comment()">
 <!--** Called by match='stylesheet' template. Finds template group separator comment and generates <h2>. Simply put comment that starts with '==' between templates as a group separator. All '=' will be deleted, so long '=====' can be used to mark the comment as separator. -->
  <xsl:if test="starts-with(.,'==')">
   <h3 class="group"><xsl:value-of select="normalize-space(translate(.,'=',''))"/></h3>
  </xsl:if>
 </xsl:template>


 <xsl:template match="xsl:template">
  <!--** Generates a template description. Steps:-->
  <!--@Determine the heading from its name or matching pattern.-->
  <h4 id="t-{translate(@name|@match,$noidchars,$escchars)}">
   <xsl:choose>
    <xsl:when test="@name"><xsl:value-of select="@name"/></xsl:when>
    <xsl:otherwise>match: <code class="pattern"><xsl:value-of select="@match"/></code>
</xsl:otherwise>
   </xsl:choose>
   <xsl:if test="@mode">
    <code class="mode">&#x00ab;<xsl:value-of select="@mode"/>&#x00bb;</code>
   </xsl:if>
  </h4>
  <div class="template-desc">
   <!--@Find a description from the first comment inside the template.-->
   <div class="abstract"><xsl:apply-templates select="comment()[1]" mode="tmpl"/></div>
   <!--@Find parameters, variables, template calls within the template.-->
   <xsl:call-template name="params"/>
   <xsl:call-template name="vars">
    <xsl:with-param name="v" select=".//xsl:variable"/>
   </xsl:call-template>
   <xsl:call-template name="tmplcall"/>
   <!--@Also find templates which call this template.-->
   <xsl:call-template name="calledby"/>
  </div>
 </xsl:template>


 <xsl:template match="comment()" mode="tmpl">
  <!--** Called by match='template' template. Returns comment node text if it begins with '**'. If the comment has a phrase 'Steps:', sibling comments that start with '@' will be listed as <ol>, which can be used to annotate parts of a template. Steps:-->

  <!--@If a comment starts with '**'-->
  <xsl:if test="starts-with(.,'**')">
  <!--@show the comment text (excl. '**') and set class='comnt'.-->
   <span class="comnt"><xsl:value-of select="substring(.,3)"/></span>
   <!--@And if it also has 'Steps:'-->
   <xsl:if test="contains(.,'Steps:')">
    <!--@find sibling comments-->
    <xsl:variable name='sibl' select="..//comment()"/><!--**sibling comments, i.e. comment nodes of the parent node-->
    <!--@and display them as <ol>-->
    <ol>
     <xsl:for-each select="$sibl">
      <xsl:if test="starts-with(.,'@')">
       <li><xsl:value-of select="substring(.,2)"/></li>
      </xsl:if>
     </xsl:for-each>
    </ol>
   </xsl:if>
  </xsl:if>
 </xsl:template>

 <!--=========================== Named templates ===========================-->

 <xsl:template name="params">
  <!--** Lists up parameters of a template if exists. If the first sibling comment begins with '**', display it, too. -->
  <xsl:variable name="p" select="xsl:param"/>
  <xsl:if test="count($p) &gt; 0">
   <p class="item">parameters:</p>
   <ul>
    <xsl:for-each select="$p">
     <li><dfn>$<xsl:value-of select="./@name"/></dfn>: <xsl:apply-templates select="following::node()[1]" mode="tmpl"/></li>
    </xsl:for-each>
   </ul>
  </xsl:if>
 </xsl:template>

 <xsl:template name="vars">
  <!--** Lists up variable names and their select attributes in a template if exists. If the first sibling comment begins with '**', display it, too.-->
  <xsl:param name="v"/>
  <xsl:if test="count($v) &gt; 0">
   <p class="item">variables:</p>
   <ul>
    <xsl:for-each select="$v">
     <li>
      <dfn>$<xsl:value-of select="./@name"/></dfn>
      <xsl:text>: </xsl:text>
      <xsl:choose>
       <xsl:when test="@select">
        <code><xsl:value-of select="./@select"/></code>
       </xsl:when>
       <xsl:when test="not(*)">
        <!--<pre><code><xsl:apply-templates select="text()"/></code></pre> @@not sure why <pre>-->
        <code><xsl:apply-templates select="text()"/></code>
       </xsl:when>
       <xsl:otherwise><em>(complex definition not shown here)</em></xsl:otherwise>
      </xsl:choose>
      <xsl:text> </xsl:text>
      <xsl:apply-templates select="following::node()[1]" mode="tmpl"/>
     </li>
    </xsl:for-each>
   </ul>
  </xsl:if>
 </xsl:template>

 <xsl:template match="rdf:Description">
  <!--** Expects an RDF/XML as the document description-->
  <h2>Document metadata</h2>
  <p class="docdescr"><xsl:apply-templates select="doas:description"/></p>
  <dl>
   <xsl:apply-templates select="doas:*[local-name() != 'title' and local-name() != 'description'] "/>
  </dl>
 </xsl:template>

 <xsl:template match="doas:*">
  <!--** Presents each doas property. -->
  <dt><xsl:value-of select="name()"/></dt>
  <dd>
   <xsl:choose>
    <xsl:when test="name()='release'">
  date: <xsl:value-of select="doas:created"/>, 
  version: <xsl:value-of select="doas:revision"/>
    </xsl:when>
    <xsl:when test="name()='author'">
     <xsl:choose>
      <xsl:when test=".//@rdf:resource='mailto:webmaster@kanzaki.com'">
       <xsl:value-of select="."/> (<a href="/info/disclaimer#webmastermail">See contact information</a>)
      </xsl:when>
      <xsl:when test=".//@rdf:resource">
       <a href="{.//@rdf:resource}"><xsl:value-of select="."/></a>
      </xsl:when>
      <xsl:otherwise>
       <xsl:value-of select="."/>
      </xsl:otherwise>
     </xsl:choose>
    </xsl:when>
    <xsl:when test="@rdf:resource">
     <a href="{@rdf:resource}">
      <xsl:choose>
       <xsl:when test="@rdfs:label">
        <xsl:value-of select="@rdfs:label"/>
       </xsl:when>
       <xsl:otherwise>
        <xsl:value-of select="@rdf:resource"/>
       </xsl:otherwise>
      </xsl:choose>
     </a>
    </xsl:when>
    <xsl:otherwise>
     <xsl:value-of select="."/>
    </xsl:otherwise>
   </xsl:choose>
  </dd>
 </xsl:template>


 <xsl:template match="doas:description">
  <!--** Presents doas description. -->
  <xsl:if test="@xml:lang='ja'">
   <img src="images/kanzaki/jp.gif" alt="[J]"/>
  </xsl:if>
  <xsl:value-of select="."/>
 </xsl:template>



 <xsl:template name="style-global">
  <!--** Describes XSLT's glocal settings. Steps: -->
  <h2>Stylesheet descriptions</h2>
  <dl>
   <!--@ show if there is any output option -->
   <xsl:if test="xsl:output[@*]">
    <dt>XSLT version</dt>
    <dd><xsl:value-of select="@version"/></dd>
    <dt>Output options</dt><dd>
    <dl>
     <xsl:for-each select="xsl:output/@*">
      <dt><xsl:value-of select="name()"/></dt>
      <dd><xsl:value-of select="."/></dd>
     </xsl:for-each>
    </dl></dd>
   </xsl:if>
   <!--@ show if there is any external file -->
   <xsl:call-template name="check-external"/>
   <!--@ show global variables and parameters -->
   <dt>Globals</dt><dd>
   <xsl:call-template name="params"/>
   <xsl:call-template name="vars">
    <xsl:with-param name="v" select="xsl:variable"/>
   </xsl:call-template>
   </dd>
  </dl>
 </xsl:template>

 <xsl:template name="check-external">
  <!--** Lists up linked external XSLT, CSS stylesheets and javascripts. -->
  <xsl:if test="xsl:include or xsl:import or .//h:link[@rel='stylesheet'] or .//h:script">
   <dt>Externals</dt><dd>
    <xsl:call-template name="genextref">
     <xsl:with-param name="dt">Included or imported XSLT</xsl:with-param>
     <xsl:with-param name="ref" select="xsl:include/@href|xsl:import/@href"/>
    </xsl:call-template>
    <xsl:call-template name="genextref">
     <xsl:with-param name="dt">CSS linked</xsl:with-param>
     <xsl:with-param name="ref" select=".//h:link[@rel='stylesheet']/@href"/>
    </xsl:call-template>
    <xsl:call-template name="genextref">
     <xsl:with-param name="dt">External scripts</xsl:with-param>
     <xsl:with-param name="ref" select=".//h:script/@src"/>
    </xsl:call-template>
   </dd>
  </xsl:if>
 </xsl:template>

 <xsl:template name="genextref">
  <!--** Generates link(s) to external resource(s) (for XSLT include, CSS link, scripts) -->
  <xsl:param name="dt"/><!--**<dt> element for the link-->
  <xsl:param name="ref"/><!--**node set of references to externals-->
  <xsl:if test="count($ref) &gt; 0">
   <dt><xsl:value-of select="$dt"/></dt>
   <xsl:for-each select="$ref">
    <dd><a href="{.}"><xsl:value-of select="."/></a></dd>
   </xsl:for-each>
  </xsl:if>
 </xsl:template>



 <xsl:template name="tmplcall">
  <!--** Lists up calls to other templates within a template. -->
  <xsl:variable name="nt" select=".//xsl:call-template"/>
  <xsl:variable name="mt" select=".//xsl:apply-templates"/>
  <xsl:if test="count($nt) + count($mt) &gt; 0">
   <p class="item">template calls:</p>
   <ul>
    <xsl:for-each select="$nt|$mt">
     <li><xsl:call-template name="tmplparams"/></li>
    </xsl:for-each>
   </ul>
  </xsl:if>
 </xsl:template>

 <xsl:template name="tmplparams">
  <!--** Displays name/select attribute of a template call with parameters list. -->
  <xsl:variable name="n" select="@name"/>
  <xsl:variable name="m" select="@select"/>
  <xsl:variable name="p" select="xsl:with-param"/>
  <xsl:call-template name="tmplname"/>
  <xsl:if test="count($p) &gt; 0">
   <code> (
   <xsl:for-each select="$p">
    <xsl:value-of select="@name"/>:
    <xsl:value-of select=".//@select"/>
    <xsl:value-of select="./*"/>
    <xsl:if test="position() != last()">, </xsl:if>
   </xsl:for-each>
   )</code>
  </xsl:if>
  <xsl:if test="@mode">
   <code class="mode">&#x00ab;<xsl:value-of select="@mode"/>&#x00bb;</code>
  </xsl:if>
 </xsl:template>


 <xsl:template name="tmplname">
  <!--** Names template according to its name|match|select attribute, and set a link to its description -->
  <xsl:choose>
   <xsl:when test="@name">named: <a href="#t-{@name}"><xsl:value-of select="@name"/></a></xsl:when>
   <xsl:when test="@match">match: { <a href="#t-{translate(@match,$noidchars,$escchars)}"><xsl:value-of select="@match"/></a> }</xsl:when>
   <xsl:otherwise>match: { 
    <xsl:variable name="s" select="@select"/>
    <xsl:choose>
     <xsl:when test="//xsl:template[@match=$s]">
      <a href="#t-{translate($s,$noidchars,$escchars)}"><xsl:value-of select="$s"/></a>
     </xsl:when>
     <xsl:otherwise><xsl:value-of select="$s"/></xsl:otherwise>
    </xsl:choose>
  }</xsl:otherwise>
  </xsl:choose>
 </xsl:template>


 <xsl:template name="calledby">
  <!--** Lists up the parent templates that call current template. -->
  <xsl:variable name="n" select="@name|@match"/>
  <xsl:variable name="parents" select="//xsl:stylesheet/xsl:template[.//xsl:call-template[@name=$n] or .//xsl:apply-templates[@select=$n]]"/>
  <xsl:if test="count($parents) &gt; 0">
   <p class="item">(explicitly) called by:</p>
   <ul>
    <xsl:for-each select="$parents">
     <li><xsl:call-template name="tmplname"/></li>
    </xsl:for-each>
   </ul>
  </xsl:if>
 </xsl:template>


 <xsl:include href="./banner-footer.xsl"/>

</xsl:stylesheet>
