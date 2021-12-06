import Bannerbear from '../bannerbear';

const main = async () => {
  const bb = new Bannerbear('Jch019Jdf22TzjsrBmPJtAtt');
  const res = await bb.create_image('20KwqnDEAAyDl17dYG', {"modifications": [
      {
        "name": "background",
        "color": null
      },
      {
        "name": "name",
        "text": "You can change this text",
        "color": null,
        "background": null
      },
      {
        "name": "avatar",
        "image_url": "https://cdn.bannerbear.com/sample_images/welcome_bear_photo.jpg"
      },
      {
        "name": "handle",
        "text": "You can change this text",
        "color": null,
        "background": null
      },
      {
        "name": "tweet_with_highlights",
        "text": "You can change this text",
        "color": null,
        "background": null
      }
    ],
    "webhook_url": null,
    "transparent": false,
    "metadata": null
  })

  console.log(res);

  return true;
}

main().then((res) => {
  console.log(res);
  return true;
});
