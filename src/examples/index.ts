import Bannerbear from '../bannerbear';

const main = async () => {
  const bb = new Bannerbear('Jch019Jdf22TzjsrBmPJtAtt');
  // await bb.create_image('20KwqnDEAAyDl17dYG', {"modifications": [
  //     {
  //       "name": "background",
  //       "color": null
  //     },
  //     {
  //       "name": "name",
  //       "text": "You can change this text",
  //       "color": null,
  //       "background": null
  //     },
  //     {
  //       "name": "avatar",
  //       "image_url": "https://cdn.bannerbear.com/sample_images/welcome_bear_photo.jpg"
  //     },
  //     {
  //       "name": "handle",
  //       "text": "You can change this text",
  //       "color": null,
  //       "background": null
  //     },
  //     {
  //       "name": "tweet_with_highlights",
  //       "text": "You can change this text",
  //       "color": null,
  //       "background": null
  //     }
  //   ],
  //   "webhook_url": null,
  //   "transparent": false,
  //   "metadata": null
  // })

  // const images = await bb.create_image(
  //   "template uid",
  //   {
  //     modifications: [
  //       {
  //         name: "headline",
  //         text: "Hello world!",
  //       },
  //       {
  //         name: "photo",
  //         image_url:
  //           "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1000&q=80",
  //       },
  //     ],
  //   },
  //   true
  // );
  // console.log(images);
  const imageList = await bb.list_images();
  console.log(imageList);

  return true;
}

main().then((res) => {
  console.log(res);
  return true;
});
