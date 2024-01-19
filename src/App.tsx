import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./App.css";
import { useRef } from "react";
import { FileLoader, UploadResponse } from "@ckeditor/ckeditor5-upload";

function App() {
  const ckEditor = useRef<ClassicEditor | null>(null);

  const insertImage = (imageUrl: string) => {
    ckEditor.current?.model.change((writer) => {
      const imageElement = writer.createElement("imageInline", {
        src: imageUrl,
      });
      ckEditor.current?.model.insertContent(
        imageElement,
        ckEditor.current?.model.document.selection
      );
    });
  };

  return (
    <div className="App">
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor 5!</p>"
        config={{
          toolbar: [],
          image: {
            toolbar: [],
            insert: {
              type: "inline",
            },
          },
          extraPlugins: [MyCustomUploadAdapterPlugin],
        }}
        onReady={(editor) => {
          ckEditor.current = editor;
          console.log("CKEditor5 React Component is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
        }}
      />

      <div>
        <button
          onClick={() => {
            insertImage("https://www.baidu.com/img/bd_logo1.png");
          }}
        >
          插入图片
        </button>
      </div>
    </div>
  );
}

export default App;

function MyCustomUploadAdapterPlugin(editor: ClassicEditor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new ObjectURLUploadAdapter(loader);
  };
}

class ObjectURLUploadAdapter {
  loader: FileLoader;

  constructor(loader: FileLoader) {
    this.loader = loader;
  }

  upload(): Promise<UploadResponse> {
    console.log(this.loader);

    return this.loader.file.then(
      (file) =>
        new Promise((resolve) => {
          console.log(file);

          // 创建 Object URL
          const objectUrl = URL.createObjectURL(file!);
          resolve({ default: objectUrl });
        })
    );
  }

  abort() {
    // 可以在这里处理上传中断逻辑
  }
}
