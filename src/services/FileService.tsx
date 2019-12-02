export default class FileService {
	public static readUploadedFileAsText = async (inputFile: File): Promise<string> => {
		const temporaryFileReader = new FileReader();

		return new Promise((resolve, reject) => {
			temporaryFileReader.onerror = () => {
				temporaryFileReader.abort();
				reject(new DOMException("Error while parsing input file."));
			};

			temporaryFileReader.onload = () => {
				resolve((temporaryFileReader.result || "") as string);
			};
			temporaryFileReader.readAsText(inputFile);
		});
	};
}
