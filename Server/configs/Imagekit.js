import ImageKit from '@imagekit/nodejs';

const Imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

export default Imagekit;
