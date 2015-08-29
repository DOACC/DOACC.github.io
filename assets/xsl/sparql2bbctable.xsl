<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sparql="http://www.w3.org/2005/sparql-results#">

<xsl:template match="/">
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="sparql:sparql">
  <xsl:text>[table]</xsl:text>
    <xsl:apply-templates/>
  <xsl:text>[/table]</xsl:text>
</xsl:template>

<xsl:template match="sparql:head">
  <xsl:text>[tr]</xsl:text>
    <xsl:apply-templates/>
  <xsl:text>[/tr]</xsl:text>
</xsl:template>

<xsl:template match="sparql:variable">
  <xsl:text>[td][b]</xsl:text>
    <xsl:value-of select="@name"/>
  <xsl:text>[/b][/td]</xsl:text>
</xsl:template>


<xsl:template match="sparql:results/sparql:result">
  <xsl:variable name="current" select="."/>
  <xsl:text>[tr]</xsl:text>
    <xsl:for-each select="/sparql:sparql/sparql:head/sparql:variable/@name">
      <xsl:variable name="variable" select="."/>
      <xsl:text>[td]</xsl:text>
        <xsl:apply-templates select="$current/sparql:binding[@name=$variable]/*"/>
      <xsl:text>[/td]</xsl:text>
    </xsl:for-each>
  <xsl:text>[/tr]</xsl:text>
</xsl:template>

<xsl:template match="sparql:binding">
  <xsl:text>[td]</xsl:text>
    <xsl:apply-templates/>
  <xsl:text>[/td]</xsl:text>
</xsl:template>

<xsl:template match="sparql:binding/sparql:uri">
    <xsl:text>[url=</xsl:text><xsl:value-of select="."/><xsl:text>]</xsl:text>
    <xsl:value-of select="."/>
    <xsl:text>[/url]</xsl:text>
</xsl:template>

<xsl:template match="sparql:binding/sparql:literal">
  <xsl:value-of select="."/>
</xsl:template>

<xsl:template match="sparql:binding/sparql:bnode">
  <xsl:text>_:</xsl:text><xsl:value-of select="."/>
</xsl:template>

<!--
<xsl:template match="sparql:binding/sparql:unbound">
  <xsl:text>Unbound</xsl:text>
</xsl:template>
-->


</xsl:stylesheet>
