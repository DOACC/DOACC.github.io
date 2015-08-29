/*
 Language: N3
 Author: Graham Higgins <gjh@bel-epa.com>
 Description: Notation 3
 */
window.hljs.registerLanguage(
  'n3',
  function(hljs) {
    return {
      aliases: ['n3', 'N3'],
      keywords: '@prefix',
      contains: [
        // {className: 'param', begin: '<http://purl.org/net/bel-epa/doacc>'}
        // {className: 'param', begin: '\\@prefix ^[a-z]+\\: ([a-zA-Z0-9\\:\\-_]+|\\[\\s*\\]|&lt;[^ \\&gt;]*&gt;)\\s* \\.', end: '\\.'}
        //{className: 'param', begin: '<', end: '>'},
        {className: 'string', begin: '^(https?:\\/\\/)?'                                       // protocol
                    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'  // domain name
                    + '((\\d{1,3}\\.){3}\\d{1,3}))'                       // OR ip (v4) address
                    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'                   // port and path
                    + '(\\?[;&a-z\\d%_.~+=-]*)?'                          // query string
                    + '(\\#[-a-z\\d_]*)?$'},
        {className: 'string',   begin: '<', end: '>', subLanguage:'html', subLanguageMode: 'continuous' },
        {className: 'keyword',  begin: '^(@(prefix))\\s(.*?)\\:\\s+\\&lt;(.*?)\\&gt;\\s*\\.'},
        {className: 'language', begin: '@[a-z]+', end: /$/},
        {className: 'subject',  begin: '^[a-z]+\\:[a-zA-Z_]+ a owl:Class ;'},
        // {className: 'param', begin: '^(@(prefix))\\s(.*?)\\:\\s+<(.*?)>\\s*\\.' // '^(\\@(?:prefix|base|keywords))(\\s+.*?)?\\s+(&lt;[^ \\&gt;]*&gt;)\\s*.'},
        {className: 'relation', begin: '[a-z]+\\:[a-zA-Z_]+'},
        {className: 'function', begin: '([a-zA-Z0-9\\:\\-_]+|\\[\\s*\\]|&lt;[^ \\&gt;]*&gt;)\\s*'},
        // hljs.COMMENT('#[^#\r\n\t ]+', '$'),
        {className: 'string', begin: '"""', end: '"""'},
        hljs.HASH_COMMENT_MODE,
        hljs.QUOTE_STRING_MODE,
      ]
    };
  }
)
