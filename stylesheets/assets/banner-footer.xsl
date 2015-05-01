<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns="http://www.w3.org/1999/xhtml">
 
 <xsl:template name="banner">
  <header class="banner" id="banner" role="banner">
   <!--
   <div id="stinfo-navi">
    <a href="#navskip" id="bnsl" name="bnsl" tabindex="10"><img src="/parts/univ.gif" alt="Skip navi. Also, " title="Experiment to skip a common header" width="22" height="20" /></a>
    <img src="/parts/help.gif" alt="information finding" width="13" height="12" /><a href="/info/navi" title="Navigation help document: " accesskey="h" rel="help">Help</a>
    <img src="/parts/tri-d.png" alt=" Page status: " width="9" height="8" /><a href="#stinfo" id="snavi" name="snavi" title="Editorial status of this page, copyrights, etc.">Status info</a>
   </div>
   -->
   <!-- eoi(stinfo-navi) -->
   <!--
   <a href="/"><img src="/images/kanzaki/logo.png" id="twk-logo" width="88" height="31" alt="The Web KANZAKI " title="Go to the top page of this site" /></a>
   <span id="gnavi">
    <a href="/#epages" title="English introduction to Japanese arts and computing">Japan</a>, 
    <a href="/#music" title="Japanese contens on Music, such as Cntrabass pages and Norrington pages">Music</a>, 
    <a href="/#docs" title="Japanese articles on Semanticweb, Internet standards etc">Internet &amp; Computer</a>
   </span>
    -->
   <!-- eoi(gnavi) -->
  </header>
 </xsl:template>



 <xsl:template name="footer">
  <p class="small">
    Note: This document is presented for a visual user agent via XSLT. See source for actual XML.
    Copyright: <a href="http://www.kanzaki.com/">Kanzaki, Masahide</a>
  </p>
  <!--
  <xsl:param name="cy"/>
  <xsl:param name="status"/>
  <xsl:param name="validate"/>
  <p>
   <xsl:if test="$validate='yes'">
    <input type="image" src="http://www.kanzaki.com/parts/rdf_metadata.gif" alt="RDF Meadata" class="sign" title="Validate and show Graph" onclick="validate()" />
   </xsl:if>
  Note: This document is presented for a visual user agent via XSLT. See source for actual XML.</p>

  <footer role="contentinfo" id="cif0" lang="">
   <address>
   By <a href="/info/who" class="fn url" rel="author">KANZAKI, Masahide</a> (see <a href="/info/webwho.rdf" title="personal profile in RDF">FOAF</a> or <a href="/" title="The Web KANZAKI home">home</a>), <a title="disclaimer, rights and contact info" href="/info/disclaimer">&#x00A9;<xsl:value-of select="$cy"/></a>.
    <xsl:choose>
     <xsl:when test="/rdf:RDF/*/dc:creator">Creator described in the source RDF is <xsl:value-of select="/rdf:RDF/*/dc:creator"/>.</xsl:when>
     <xsl:otherwise>Copyrights of the rendered contents depend on source XML and generated links.</xsl:otherwise>
    </xsl:choose>
   </address>
   <span id="stinfo"><xsl:value-of select="$status"/></span>
  </footer>
  -->
 </xsl:template>
 
</xsl:stylesheet>