import { useUserStore } from "@/entities/User";
import { Header } from "@/widgets/Header/ui/Header";
import {
	Button,
	Card,
	Skeleton,
	SkeletonItem,
	Text,
	Title2,
	Title3,
	Toast,
	ToastBody,
	Toaster,
	ToastTitle,
	useId,
	useToastController,
} from "@fluentui/react-components";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { $api } from "@/shared/api/api";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { getExcelPage } from "@/shared/consts/router";
import { ArrowDownloadFilled } from "@fluentui/react-icons";
import { TableModal } from "@/entities/Admin/ui/Modals/Tables/TableModal";

const MainPage = memo(() => {
	const toasterId = useId("toaster-mainpage");
	const { dispatchToast } = useToastController(toasterId);

	const nav = useNavigate();
	const { user } = useUserStore();
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);
	const [excels, setExcels] = useState<ExcelFile[]>([]);
	const [isOperationLoading, setIsOperationLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const notify = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("error fetch excel")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	const fetchExcels = async () => {
		try {
			setIsLoading(true);
			const res = await $api.get<void, AxiosResponse<{ files: ExcelFile[] }>>("/excel/files");
			if (res.data) {
				setExcels(res.data.files);
			} else {
				notify();
			}
		} catch (e) {
			console.log(e);
			notify();
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchExcels();
	}, []);

	return (
		<>
			<TableModal
				isOpen={isOpen}
				isOperationLoading={isOperationLoading}
				mode="create"
				onClose={() => setIsOpen(false)}
				onSave={async (saveData) => {
					setIsOperationLoading(true);
					try {
						await $api.post("/excel/create", { filename: saveData.name });
						fetchExcels();
					} catch (e) {
						console.log(e);
						notify();
					} finally {
						setIsOperationLoading(false);
					}
				}}
				table={{ download_link: "", id: "", last_modified: "", name: "", size: 0 }}
			/>
			<Toaster toasterId={toasterId} />
			<Header />
			<div className="p-8">
				<div className="flex justify-between">
					<Title2>
						{t("Hello")}, {user?.firstName} {user?.lastName}!
					</Title2>
					<Button onClick={() => setIsOpen(true)}>{t("create")}</Button>
				</div>

				<div className={excels.length === 0 ? "flex justify-center items-center h-64" : "grid grid-cols-3 gap-3  pt-6"}>
					{excels.length === 0 && <Title3>{t("no tables")}</Title3>}
					{isLoading ? (
						<>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
						</>
					) : (
						excels?.map((excel) => (
							<Card>
								<Title3>{excel.name}</Title3>
								<Text>
									{t("size")}:{" "}
									{excel.size / 1024 > 1024
										? `${(excel.size / 1024 / 1024).toFixed(2)}МБ`
										: `${(excel.size / 1024).toFixed(2)}КБ`}
								</Text>
								<div className="flex">
									<Button
										as="a"
										style={{ marginRight: 5 }}
										href={excel.download_link}
										download={excel.name}
										icon={<ArrowDownloadFilled />}
										aria-label="Download"
									/>
									<Button className="flex-1" onClick={() => nav(getExcelPage(excel.name))} aria-label="Go">
										{t("go")}
									</Button>
								</div>
							</Card>
						))
					)}
				</div>
			</div>
		</>
	);
});

export default MainPage;
