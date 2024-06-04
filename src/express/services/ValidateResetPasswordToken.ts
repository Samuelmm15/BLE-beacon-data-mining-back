import { User } from "../../typeORM/entity/user.entity";
import { ResetPassword } from "../../typeORM/entity/resetPassword.entity";
import { getRepository } from "typeorm";

export async function validateResetPasswordToken(
  token: string,
  actualTime: number
) {
  const resetPasswordRepository = getRepository(ResetPassword);
  const resetPassword = await resetPasswordRepository.findOne({
    where: { token },
  });

  if (!resetPassword) {
    throw new Error("Token no encontrado");
  }

  if (actualTime > resetPassword.expiresAt.getTime()) {
    throw new Error("Token expirado");
  }

  return true;
}
