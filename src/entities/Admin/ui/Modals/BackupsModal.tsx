import { ExcelFile } from "@/shared/types/ExcelFile";
import {
	Button,
	Dialog,
	DialogBody,
	DialogContent,
	DialogSurface,
	DialogTitle,
	DialogTrigger,
	Text,
} from "@fluentui/react-components";
import { ArrowDownloadFilled } from "@fluentui/react-icons";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface BackupsModalProps {
	backups: { folder_name: string; files: ExcelFile[] }[];
	fileName: string;
}

export const BackupsModal: FC<BackupsModalProps> = ({ backups, fileName }) => {
	const { t } = useTranslation();
	backups.find(({ folder_name }) => fileName.includes(folder_name) || folder_name.includes(fileName));

	return (
		<Dialog>
			<DialogTrigger>
				<Button>{t("backups")}</Button>
			</DialogTrigger>
			<DialogSurface style={{ minWidth: "90%" }}>
				<DialogBody>
					<DialogTitle>{t("backups")}</DialogTitle>
					<DialogContent style={{ maxHeight: "400px", overflowY: "auto" }}>
						<div className="flex flex-col gap-2">
							{backups.find(({ folder_name }) => fileName.includes(folder_name) || folder_name.includes(fileName)) !==
							undefined ? (
								backups
									.find(({ folder_name }) => fileName.includes(folder_name) || folder_name.includes(fileName))!
									.files.map((file) => (
										<div className="grid grid-cols-[2fr_2fr_1fr_1fr]">
											<Text>{file.name}</Text>
											<Text>
												{new Date(file.last_modified)
													.toISOString()
													.replace("T", " ")
													.replace("Z", "")
													.replace(".000", "")}
											</Text>
											<Text>
												{file.size / 1024 > 1024
													? `${(file.size / 1024 / 1024).toFixed(2)}МБ`
													: `${(file.size / 1024).toFixed(2)}КБ`}
											</Text>
											<Button
												as="a"
												href={file.download_link}
												download={file.name}
												icon={<ArrowDownloadFilled />}
												aria-label="Download"
											/>
										</div>
									))
							) : (
								<Text>{t("no backups")}</Text>
							)}
						</div>
					</DialogContent>
				</DialogBody>
			</DialogSurface>
		</Dialog>
	);
};
