import formidable from 'formidable';

export const noBodyParser = {
  api: {
    bodyParser: false,
  },
};

export async function parseMultipart(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}
