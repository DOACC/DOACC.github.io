<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns="http://www.w3.org/1999/xhtml">
 
 <xsl:template name="banner">
  <hr id="navskip" class="c" />
 </xsl:template>

 <xsl:template name="footer">
  <xsl:param name="cy"/>
  <xsl:param name="status"/>
  <xsl:param name="validate"/>
  <p>
   <xsl:if test="$validate='yes'">
    <input type="image" src="http://www.kanzaki.com/parts/rdf_metadata.gif" alt="RDF Meadata" class="sign" title="Validate and show Graph" onclick="validate()" />
   </xsl:if>
  Note: This document is presented for a visual user agent via XSLT. See source for actual XML.</p>
  <hr />
  <address>This is <a href="http://www.kanzaki.com/">The Web KANZAKI</a>.
   <a href="http://www.kanzaki.com/info/disclaimer">&#x00A9;<xsl:value-of select="$cy"/> by MK</a>. 
   <xsl:choose>
    <xsl:when test="/rdf:RDF/*/dc:creator">Creator described in the source RDF is <xsl:value-of select="/rdf:RDF/*/dc:creator"/>.</xsl:when>
    <xsl:otherwise>Copyrights of the rendered contents depend on source XML and generated links.</xsl:otherwise>
   </xsl:choose>
   <br />
   <span id="stinfo"><xsl:value-of select="$status"/></span>
  </address>
  <script type="text/javascript">
   function validate(){
    location.href= "http://www.w3.org/RDF/Validator/ARPServlet?URI=" + document.location;
   }
  </script>
 </xsl:template>
 
</xsl:stylesheet>