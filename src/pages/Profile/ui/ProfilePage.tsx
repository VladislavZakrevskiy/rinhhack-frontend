import {
	Avatar,
	Card,
	CardHeader,
	Skeleton,
	SkeletonItem,
	Subtitle2,
	Text,
	Title3,
	Toast,
	ToastBody,
	Toaster,
	ToastTitle,
	useId,
	useToastController,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { $api } from "@/shared/api/api";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Employee } from "@/shared/types/Employee";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/entities/User";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { Header } from "@/widgets/Header/ui/Header";

const ProfilePage = () => {
	const toasterId = useId("toaster-profile");
	const { dispatchToast } = useToastController(toasterId);
	const { id } = useParams();
	const { t } = useTranslation();
	const { user } = useUserStore();
	const [isLoading, setIsLoading] = useState(false);
	const [isExcelLoading, setIsExcelLoading] = useState(false);
	const [isLastExcelLoading, setIsLastExcelLoading] = useState(false);
	const [currentUser, setCurrentUser] = useState<Employee & { first_name: string; last_name: string }>();
	const [excels, setExcels] = useState<ExcelFile[]>([]);
	const [lastExcel, setLastExcel] = useState<ExcelFile>();

	const notify = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("error fetch user")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	const notifyExcel = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("error fetch excel")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	useEffect(() => {
		const fetchMe = async () => {
			try {
				setIsLoading(true);
				const res = await $api.get<void, AxiosResponse<Employee & { first_name: string; last_name: string }>>(
					"/users/" + id,
				);
				if (res.data) {
					setCurrentUser(res.data);
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
		fetchMe();
	}, [id]);

	useEffect(() => {
		const fetchLastExcel = async () => {
			try {
				setIsLastExcelLoading(true);
				const res = await $api.get<void, AxiosResponse<ExcelFile>>("/excel/user/last");
				if (res.data) {
					setLastExcel(res.data);
				} else {
					notifyExcel();
				}
			} catch (e) {
				console.log(e);
				notifyExcel();
			} finally {
				setIsLastExcelLoading(false);
			}
		};
		fetchLastExcel();
	}, [id]);

	useEffect(() => {
		const fetchExcels = async () => {
			try {
				setIsExcelLoading(true);
				const res = await $api.get<void, AxiosResponse<ExcelFile[]>>("/excel/user");
				if (res.data) {
					setExcels(res.data);
				} else {
					notifyExcel();
				}
			} catch (e) {
				console.log(e);
				notifyExcel();
			} finally {
				setIsExcelLoading(false);
			}
		};
		fetchExcels();
	}, [id]);

	if (currentUser?.id === user?.id) {
		return (
			<>
				<Header />
				<Toaster toasterId={toasterId} />
				<div className="grid grid-cols-2 gap-4 p-6">
					<Card>
						{isLoading ? (
							<>
								<div className="flex gap-3 items-center w-full">
									<Skeleton aria-label="Loading Content">
										<SkeletonItem shape="circle" size={64} />
									</Skeleton>
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={36} />
									</Skeleton>
								</div>
								<div className="flex flex-col gap-3 w-full h-full">
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={24} />
									</Skeleton>
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={24} />
									</Skeleton>
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={24} />
									</Skeleton>
								</div>
							</>
						) : (
							<>
								<div className="flex gap-3 items-center">
									<Avatar
										size={64}
										aria-label={currentUser?.first_name}
										name={currentUser?.first_name + " " + currentUser?.last_name}
										badge={{ status: "available" }}
									/>
									<Title3>
										{currentUser?.first_name} {currentUser?.last_name}
									</Title3>
								</div>
								<div className="flex flex-col items-start ">
									<Subtitle2>
										{t("email")}: {currentUser?.email}
									</Subtitle2>
									<Subtitle2>
										{t("position")}: {currentUser?.position}
									</Subtitle2>
									<Subtitle2>
										{t("department")}: {currentUser?.department}
									</Subtitle2>
								</div>
							</>
						)}
					</Card>
					<Card>
						<Title3>{t("lastModified excel")}</Title3>
						{isLastExcelLoading ? (
							<>
								<Skeleton aria-label="Loading Content">
									<SkeletonItem size={96} />
								</Skeleton>
							</>
						) : lastExcel ? (
							<>
								<Subtitle2>{lastExcel?.name}</Subtitle2>
								<div className="flex gap-2">
									<Avatar
										aria-label={lastExcel?.creator.firstName}
										name={lastExcel?.creator.firstName + " " + lastExcel?.creator.lastName}
										badge={{ status: "available" }}
									/>
									<Text>
										{lastExcel?.creator.firstName} {lastExcel?.creator.lastName}
									</Text>
								</div>
							</>
						) : (
							<Subtitle2>{t("no lastModified")}</Subtitle2>
						)}
					</Card>
				</div>

				<div
					className={
						excels.length === 0 && !isExcelLoading
							? "flex justify-center items-center h-64"
							: "grid grid-cols-3 gap-3 p-6 pt-6"
					}
				>
					{excels.length === 0 && !isExcelLoading && <Title3>{t("no tables")}</Title3>}
					{isExcelLoading ? (
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
						excels.map((excel) => (
							<Card>
								<CardHeader>
									<Title3>{excel.name}</Title3>
								</CardHeader>
								<div className="flex gap-2">
									<Avatar
										aria-label={excel.creator.firstName}
										name={excel.creator.firstName + " " + excel.creator.lastName}
										badge={{ status: "available" }}
									/>
									<Text>
										{excel.creator.firstName} {excel.creator.lastName}
									</Text>
								</div>
							</Card>
						))
					)}
				</div>
			</>
		);
	} else {
		return (
			<>
				<Toaster toasterId="" />
				<div className="grid grid-cols-2 p-6">
					<Card>
						<div className="flex gap-3 items-center">
							<Avatar
								size={64}
								aria-label={currentUser?.first_name}
								name={currentUser?.first_name + " " + currentUser?.last_name}
								badge={{ status: "available" }}
							/>
							<Title3>
								{currentUser?.first_name} {currentUser?.last_name}
							</Title3>
						</div>
						<div className="flex flex-col items-start ">
							<Subtitle2>
								{t("email")}: {currentUser?.email}
							</Subtitle2>
							<Subtitle2>
								{t("position")}: {currentUser?.position}
							</Subtitle2>
							<Subtitle2>
								{t("department")}: {currentUser?.department}
							</Subtitle2>
						</div>
					</Card>
				</div>
			</>
		);
	}
};

export default ProfilePage;
