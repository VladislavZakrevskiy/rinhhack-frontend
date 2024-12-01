import { ExcelFile } from "@/shared/types/ExcelFile";
import { TextField } from "@fluentui/react";
import {
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
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
import { FC, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

interface BackupsModalProps {
	backups: { folder_name: string; files: ExcelFile[] }[];
}

export const BackupsModal: FC<BackupsModalProps> = ({ backups }) => {
	const { t } = useTranslation();
	const [currentBackups, setCurrentBackups] = useState(backups);
	const [search, setSearch] = useState<string>("");

	const handleSearchChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string | undefined) => {
		setSearch(newValue || "");
		if (newValue === "" || !newValue) {
			setCurrentBackups(backups);
		} else {
			setCurrentBackups((prev) => prev.filter(({ folder_name }) => folder_name.includes(newValue)));
		}
	};

	return (
		<Dialog>
			<DialogTrigger>
				<Button>{t("backups")}</Button>
			</DialogTrigger>
			<DialogSurface>
				<DialogBody>
					<DialogTitle>{t("backups")}</DialogTitle>
					<DialogContent style={{ maxHeight: "400px", overflowY: "auto" }}>
						<TextField
							label="Поиск..."
							value={search}
							onChange={handleSearchChange}
							styles={{ root: { marginBottom: "15px" } }}
						/>

						<ul style={{ listStyleType: "none", padding: 0 }}>
							{currentBackups.map((backup) => (
								<AccordionItem value={backup.folder_name}>
									<AccordionHeader>{backup.folder_name}</AccordionHeader>
									<AccordionPanel>
										{backup.files.map((file) => (
											<div className="grid grid-cols-4">
												<Text>{file.name}</Text>
												<Text>{new Date(file.last_modified).toISOString()}</Text>
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
										))}
									</AccordionPanel>
								</AccordionItem>
							))}
						</ul>
					</DialogContent>
				</DialogBody>
			</DialogSurface>
		</Dialog>
	);
};
