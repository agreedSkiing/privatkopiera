import defaultOptions from './defaultOptions.js';
import { isAndroid } from './utils.js';

const options = {
  default_video_file_extension:
    localStorage.default_video_file_extension ||
    defaultOptions.default_video_file_extension,
  default_audio_file_extension:
    localStorage.default_audio_file_extension ||
    defaultOptions.default_audio_file_extension,
  svt_video_format:
    localStorage.svt_video_format ||
    defaultOptions.svt_video_format,
  ffmpeg_command: localStorage.ffmpeg_command || defaultOptions.ffmpeg_command,
  output_path: localStorage.output_path || defaultOptions.output_path,
};

document.addEventListener('DOMContentLoaded', async () => {
  const platformInfo = await chrome.runtime.getPlatformInfo();
  const pathSeparator = platformInfo.os === 'win' ? '\\' : '/';
  const exampleOutputPath =
    platformInfo.os === 'win'
      ? 'C:\\Användare\\Svensson\\Skrivbord\\'
      : platformInfo.os === 'mac'
      ? '/Users/Svensson/Downloads/'
      : '/home/svensson/Downloads/';

  const theme =
    localStorage.getItem('theme') ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');
  document.documentElement.setAttribute('data-bs-theme', theme);

  if (isAndroid) {
    document.body.classList.add('mobile');
    document.body.textContent =
      'Det finns inga inställningar som gäller för Android än.';
    return;
  }

  document.getElementById('example_output_path').textContent =
    exampleOutputPath;

  const default_video_file_extension_input = document.getElementById(
    'default_video_file_extension',
  );
  const default_audio_file_extension_input = document.getElementById(
    'default_audio_file_extension',
  );
  const svt_video_format_input = document.getElementById(
    'svt_video_format',
  );
  const ffmpeg_command_input = document.getElementById('ffmpeg_command');
  const output_path_input = document.getElementById('output_path');
  const save_button = document.getElementById('save');

  default_video_file_extension_input.value =
    options.default_video_file_extension;
  default_audio_file_extension_input.value =
    options.default_audio_file_extension;
  svt_video_format_input.value =
    options.svt_video_format;
  ffmpeg_command_input.value = options.ffmpeg_command;
  output_path_input.value = options.output_path;

  function validate(notify = false) {
    if (
      output_path_input.value.toLowerCase() === 'c:\\' ||
      output_path_input.value.toLowerCase().startsWith('c:\\windows\\')
    ) {
      if (notify) {
        alert(
          'Sökvägen som du har valt rekommenderas ej då vanliga användare normalt inte kan skapa filer där. Välj en sökväg som din användare kan skriva till.',
        );
      }
      output_path_input.classList.add('text-danger');
    } else {
      output_path_input.classList.remove('text-danger');
    }
  }
  validate();

  save_button.addEventListener('click', () => {
    localStorage.default_video_file_extension =
      default_video_file_extension_input.value;
    localStorage.default_audio_file_extension =
      default_audio_file_extension_input.value;
    localStorage.svt_video_format =
      svt_video_format_input.value;
    localStorage.ffmpeg_command = ffmpeg_command_input.value;

    if (
      output_path_input.value !== '' &&
      !output_path_input.value.endsWith(pathSeparator)
    ) {
      output_path_input.value += pathSeparator;
    }
    localStorage.output_path = output_path_input.value;

    validate(true);
  });

  for (const input of document.querySelectorAll("input[type='text']")) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        save_button.focus();
        save_button.click();
      }
    });
  }

  document.getElementById('reset').addEventListener('click', () => {
    delete localStorage.default_video_file_extension;
    delete localStorage.default_audio_file_extension;
    delete localStorage.svt_video_format;
    delete localStorage.ffmpeg_command;
    delete localStorage.output_path;

    default_video_file_extension_input.value =
      defaultOptions.default_video_file_extension;
    default_audio_file_extension_input.value =
      defaultOptions.default_audio_file_extension;
    svt_video_format_input.value =
      defaultOptions.svt_video_format;
    ffmpeg_command_input.value = defaultOptions.ffmpeg_command;
    output_path_input.value = defaultOptions.output_path;
  });
});
