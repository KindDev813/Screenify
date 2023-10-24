import { fetchFile } from "@ffmpeg/ffmpeg";

export const trimVideoFFmpeg = async (
  ffmpeg,
  fileName,
  link,
  minTime,
  maxTime
) => {
  try {
    ffmpeg.FS("writeFile", `input_${fileName}.mp4`, await fetchFile(link));
    await ffmpeg.run(
      "-i",
      `input_${fileName}.mp4`,
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-r",
      "24",
      "-f",
      "mp4",
      `output_${fileName}.mp4`
    );
    const data = ffmpeg.FS("readFile", `output_${fileName}.mp4`);
    const downUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    return downUrl;
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

export const cropVideoFFmpeg = async (
  ffmpeg,
  fileName,
  link,
  width,
  height,
  positionX,
  positionY
) => {
  try {
    ffmpeg.FS("writeFile", `input_${fileName}.mp4`, await fetchFile(link));
    await ffmpeg.run(
      "-i",
      `input_${fileName}.mp4`,
      "-filter:v",
      `crop=${width}:${height}:${positionX}:${positionY}`,
      "-r",
      "24",
      "-f",
      "mp4",
      `output_${fileName}.mp4`
    );
    const data = ffmpeg.FS("readFile", `output_${fileName}.mp4`);
    const downUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    return downUrl;
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

export const musicOverFFmpeg = async (ffmpeg, fileName, link, overMusic) => {
  try {
    ffmpeg.FS("writeFile", `input_${fileName}.mp4`, await fetchFile(link));
    ffmpeg.FS(
      "writeFile",
      `input_music_${fileName}.mp3`,
      await fetchFile(overMusic)
    );

    await ffmpeg.run(
      "-i",
      `input_${fileName}.mp4`,
      "-i",
      `input_music_${fileName}.mp3`,
      "-filter_complex",
      "[0:a][1:a]amerge=inputs=2[a]",
      "-map",
      "[a]",
      "-map",
      "0:v",
      "-shortest",
      `output_${fileName}.mp4`
    );

    const data = ffmpeg.FS("readFile", `output_${fileName}.mp4`);
    const downUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    return downUrl;
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};
