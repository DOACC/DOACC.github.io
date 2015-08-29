<?xml version="1.0" encoding="iso-8859-1"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:res="http://www.w3.org/2005/sparql-results#"
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:xhtml="http://www.w3.org/1999/xhtml" 
  exclude-result-prefixes="res xsl rdf xhtml">

  <xsl:output
    method="text" 
    encoding="UTF-8" 
/>

  <xsl:template match="/res:sparql">
 {
'dateTimeFormat': 'iso8601',
'events' : [
    <xsl:apply-templates select="res:results" />
]
}
  </xsl:template>


  <xsl:template match="/res:sparql/res:results">
    <xsl:for-each select="res:result">
<!-- apostrophes need escaping for JSON
     probably not needed for link, date -->
<xsl:variable name="title">
  <xsl:call-template name="escape">
  <xsl:with-param name="text" select="res:binding[@name='title']/res:literal"/>
  </xsl:call-template>
</xsl:variable> 
<xsl:variable name="link">
  <xsl:call-template name="escape">
  <xsl:with-param name="text" select="res:binding[@name='link']/res:literal"/>
  </xsl:call-template>
</xsl:variable> 
<xsl:variable name="date">
  <xsl:call-template name="escape">
  <xsl:with-param name="text" select="res:binding[@name='date']/res:literal"/>
  </xsl:call-template>
</xsl:variable>
<xsl:variable name="description">
  <xsl:call-template name="escape">
  <xsl:with-param name="text" select="res:binding[@name='description']/res:literal"/>
  </xsl:call-template>
</xsl:variable> 
<xsl:variable name="source">
  <xsl:call-template name="escape">
  <xsl:with-param name="text" select="res:binding[@name='source']/res:literal"/>
  </xsl:call-template>
</xsl:variable> 
        {'start': '<xsl:value-of select="$date" />',
        'title': '<xsl:value-of select="$title" />',
        'description': '<xsl:value-of select="$description" />
                        <xsl:value-of select="$source" />',
        'link': '<xsl:value-of select="$link" />',
        'image': 'dull-blue-circle.png'
        }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:for-each>
</xsl:template>

<xsl:template name="globalReplace">
  <xsl:param name="outputString"/>
  <xsl:param name="target"/>
  <xsl:param name="replacement"/>
  <xsl:choose>
    <xsl:when test="contains($outputString,$target)">
   
      <xsl:value-of select=
        "concat(substring-before($outputString,$target),
               $replacement)"/>
      <xsl:call-template name="globalReplace">
        <xsl:with-param name="outputString" 
             select="substring-after($outputString,$target)"/>
        <xsl:with-param name="target" select="$target"/>
        <xsl:with-param name="replacement" 
             select="$replacement"/>
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise>
      <xsl:value-of select="$outputString"/>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<xsl:template name="escape">
  <xsl:call-template name="globalReplace">
  <xsl:with-param name="outputString" select="$text"/>
  <xsl:with-param name="target">'</xsl:with-param>
  <xsl:with-param name="replacement">\'</xsl:with-param>
  </xsl:call-template>
</xsl:template>

<xsl:template match="text()"/>
</xsl:stylesheet>
