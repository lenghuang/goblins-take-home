# Goblins Take Home Assignment

This is my work for the take home assignment for https://goblinsapp.com/. Goblins is a startup that has an AI math tutor for students to help teachers address inequality in the classroom. My task was to make a software for contractors to use to label and annotate their CSV data. Between the initial commit and this last commit, this took me around 2 days, 10 hours of deep focus work (with breaks for sleeping and celebrating New Year's Eve) to complete.

- Live demo here: https://lenhuang-goblinsapp.web.app/
- Read about [my thought process](https://github.com/lenghuang/goblins-take-home/blob/master/my-thought-process/README.md) as I was working
- The four core PR's (https://github.com/lenghuang/goblins-take-home/pull/1) (https://github.com/lenghuang/goblins-take-home/pull/2) (https://github.com/lenghuang/goblins-take-home/pull/3) (https://github.com/lenghuang/goblins-take-home/pull/4)

# Demo Gifs

All the core functionality of labeling an image with math notation is here, as well as uploading and downloading the data. If I had more time, I would add the ability to rotate / zoom in on the crop, improved multi-line and English text labelling, and some leaderboards / aggregate statistics.

## Auth Flow

| Sign In                         | Create Account                                | Profile Page                      |
| ------------------------------- | --------------------------------------------- | --------------------------------- |
| ![signin](demo/pics/signin.png) | ![createaccount](demo/pics/createaccount.png) | ![profile](demo/pics/profile.png) |

## Browse

| Home / Page Navigation            | Whiteboards                                    |
| --------------------------------- | ---------------------------------------------- |
| ![home](demo/gifs/page%20nav.gif) | ![gallery](demo/gifs/whiteboard%20gallery.gif) |

## Data Import / Export

| CSV Upload                      | CSV Download                      |
| ------------------------------- | --------------------------------- |
| ![](demo/gifs/csv%20upload.gif) | ![](demo/gifs/download%20csv.gif) |

## Image Cropping

| Image Cropping                       | Image Whiteout on Crop         |
| ------------------------------------ | ------------------------------ |
| ![](demo/gifs/cropping%20action.gif) | ![](demo/gifs/white%20out.gif) |

| Deleting an Image                                    | Image Reset                      |
| ---------------------------------------------------- | -------------------------------- |
| ![](demo/gifs/deleting%20an%20added%20image%202.gif) | ![](demo/gifs/reset%20image.gif) |

## Labelling

| Latex Input                      | Math Keyboard                      |
| -------------------------------- | ---------------------------------- |
| ![](demo/gifs/latex%20input.gif) | ![](demo/gifs/math%20keyboard.gif) |

| Error Handling                                 | Form Submission                    |
| ---------------------------------------------- | ---------------------------------- |
| ![](demo/gifs/mathlive%20error%20handling.gif) | ![](demo/gifs/submit%20labels.gif) |
