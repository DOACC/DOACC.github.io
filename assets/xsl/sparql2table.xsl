<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sparql="http://www.w3.org/2005/sparql-results#">

<xsl:template match="/">
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="sparql:sparql">
  <table>
    <xsl:apply-templates/>
  </table>
</xsl:template>

<xsl:template match="sparql:head">
  <tr>
    <xsl:apply-templates />
  </tr>
</xsl:template>

<xsl:template match="sparql:variable">
  <th>
    <xsl:value-of select="@name"/>
  </th>
</xsl:template>


<xsl:template match="sparql:results/sparql:result">
  <xsl:variable name="current" select="."/>
  <tr>
    <xsl:for-each select="/sparql:sparql/sparql:head/sparql:variable/@name">
      <xsl:variable name="variable" select="."/>
      <td>
        <xsl:apply-templates select="$current/sparql:binding[@name=$variable]/*"/>
      </td>
    </xsl:for-each>
  </tr>
</xsl:template>

<xsl:template match="sparql:binding">
  <td>
    <xsl:apply-templates/>
  </td>
</xsl:template>

<xsl:template match="sparql:binding/sparql:uri">
  <a>
    <xsl:attribute name="href">
      <xsl:value-of select="."/>
    </xsl:attribute>
    <xsl:value-of select="."/>
  </a>
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
