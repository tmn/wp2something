var fs = require('fs')
, xml2js = require('xml2js')

var parser = new xml2js.Parser()

fs.readFile(__dirname + '/data.xml', function (err, data) {
  parser.parseString(data, function (err, result) {

    result.rss.channel[0].item.forEach(function (e) {
      if ('post'.indexOf(e['wp:post_type']) > -1) {
        var post = {
          title: e.title[0],
          author: e['dc:creator'][0],
          category: e.category.map(function (e) { return e['$'].nicename }),
          post_date: e['wp:post_date'][0],
          post_name: e['wp:post_name'][0],
          content: e['content:encoded'][0],
          link: e.link[0],
          pub_date: e.pubDate[0]
        }

        var filename = !post.post_name ? post.title : post.post_name;

        fs.writeFileSync(
          __dirname + '/posts/' + post.post_date.substring(0, 10) + '-' + filename,
          JSON.stringify(post, null, 2)
        )
      }
    })

    console.log('Done')
  })
})
