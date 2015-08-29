<?xml version='1.0'?>
<xsl:stylesheet version="1.0" 
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:atom="http://www.w3.org/2005/Atom"
		xmlns:atomowl="http://www.w3.org/2005/Atom#"
		xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
>
  <xsl:output indent="yes" method="xml"/>

  <xsl:template match="atom:id">
    <atomowl:id>
      <xsl:apply-templates/>
    </atomowl:id>
  </xsl:template>

  <xsl:template match="atom:feed[atom:title and atom:subtitle and atom:updated and atom:id 
                                  and atom:link and atom:rights and atom:generator and atom:entry]">
<rdf:RDF> 
   <atomowl:feed>
      <xsl:apply-templates/>
    </atomowl:feed>
</rdf:RDF>
  </xsl:template>

  <xsl:template match="atom:name">
    <atomowl:name>
      <xsl:apply-templates/>
    </atomowl:name>
  </xsl:template>

  <xsl:template match="atom:link">
    <atomowl:link>
      <xsl:attribute name="atomowl:href">
        <xsl:value-of select="@href"/>
      </xsl:attribute>
      <xsl:attribute name="atomowl:hreflang">
        <xsl:value-of select="@hreflang"/>
      </xsl:attribute>
      <xsl:attribute name="atomowl:rel">
        <xsl:value-of select="@rel"/>
      </xsl:attribute>
      <xsl:attribute name="atomowl:type">
        <xsl:value-of select="@type"/>
      </xsl:attribute>
      <xsl:attribute name="atomowl:length">
        <xsl:value-of select="@length"/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </atomowl:link>
  </xsl:template>

  <xsl:template match="atom:content">
    <atomowl:content rdf:parseType="Resource">
      <atomowl:type><xsl:value-of select="@type"/></atomowl:type>
      <atomowl:base><xsl:value-of select="@base"/></atomowl:base>
      <atomowl:lang><xsl:value-of select="@lang"/></atomowl:lang>
      <rdf:value><xsl:copy-of select="child::node()" /></rdf:value>
    </atomowl:content>
  </xsl:template>

  <xsl:template match="atom:published">
    <atomowl:published>
      <xsl:apply-templates/>
    </atomowl:published>
  </xsl:template>

  <xsl:template match="atom:updated">
    <atomowl:updated>
      <xsl:apply-templates/>
    </atomowl:updated>
  </xsl:template>

  <xsl:template match="atom:generator">
    <atomowl:generator rdf:parseType="Resource">
      <atomowl:uri><xsl:value-of select="@uri"/></atomowl:uri>
     <atomowl:version><xsl:value-of select="@version"/></atomowl:version>
    </atomowl:generator>
  </xsl:template>

  <xsl:template match="atom:uri">
    <atomowl:uri>
      <xsl:apply-templates/>
    </atomowl:uri>
  </xsl:template>

  <xsl:template match="atom:rights">
    <atomowl:rights>
      <xsl:apply-templates/>
    </atomowl:rights>
  </xsl:template>

  <xsl:template match="atom:entry[atom:title and atom:link and atom:id and atom:updated 
		       and atom:published and atom:author and atom:contributor and atom:content]">
    <atomowl:entry rdf:parseType="Resource">
      <xsl:apply-templates/>
    </atomowl:entry>
  </xsl:template>

  <xsl:template match="atom:author[atom:name and atom:uri and atom:email]">
    <atomowl:author rdf:parseType="Resource">
      <xsl:apply-templates/>
    </atomowl:author>
  </xsl:template>

  <xsl:template match="atom:contributor[atom:name]">
    <atomowl:contributor rdf:parseType="Resource">
      <xsl:apply-templates/>
    </atomowl:contributor>
  </xsl:template>

  <xsl:template match="atom:subtitle">
    <atomowl:subtitle rdf:parseType="Resource">
      <atomowl:type><xsl:value-of select="@type" /></atomowl:type>
     <rdf:value><xsl:value-of select="text()" /></rdf:value>
    </atomowl:subtitle>
  </xsl:template>

  <xsl:template match="atom:title">
    <atomowl:title rdf:parseType="Resource">
      <atomowl:type><xsl:value-of select="@type" /></atomowl:type>
     <rdf:value><xsl:value-of select="text()" /></rdf:value>
    </atomowl:title>
  </xsl:template>

  <xsl:template match="atom:email">
    <atomowl:email>
      <xsl:apply-templates/>
    </atomowl:email>
  </xsl:template>
 

</xsl:stylesheet>