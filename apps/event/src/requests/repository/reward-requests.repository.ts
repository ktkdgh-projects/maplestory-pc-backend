import { RewardClaimDto } from '@libs/common';
import {
    EventConditionType,
    IRewardRequest,
    mapRewardRequestDoc,
    RewardRequest,
    RewardRequestDocument,
    RewardRequestStatus,
} from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export const RewardRequestsRepositoryToken = 'RewardRequestsRepositoryToken';

@Injectable()
export class RewardRequestsRepository {
    constructor(
        @InjectModel(RewardRequest.name)
        private readonly rewardRequestsModel: Model<RewardRequestDocument>,
    ) {}

    async findByUserId(userId: string, pageParam: number, limitSize: number): Promise<IRewardRequest[]> {
        const requests = await this.rewardRequestsModel
            .find({ userId })
            .populate('eventId')
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();
        return requests.map((request) => mapRewardRequestDoc(request));
    }

    async findByUserEventId(userId: string, eventId: string): Promise<IRewardRequest | null> {
        const request = await this.rewardRequestsModel.findOne({ userId, eventId }).exec();
        return request ? mapRewardRequestDoc(request) : null;
    }

    async createRewardRequest(dto: RewardClaimDto): Promise<IRewardRequest> {
        const request = new this.rewardRequestsModel({ ...dto });
        const savedRequest = await request.save();
        return mapRewardRequestDoc(savedRequest);
    }

    async findAllWithFilters(
        pageParam: number,
        limitSize: number,
        status?: RewardRequestStatus,
        conditionType?: EventConditionType,
    ) {
        const pipeline: any[] = [];
        if (status) {
            pipeline.push({ $match: { status } });
        }

        pipeline.push({
            $lookup: {
                from: 'events',
                localField: 'eventId',
                foreignField: '_id',
                as: 'event',
            },
        });

        pipeline.push({ $unwind: '$event' });

        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        });

        pipeline.push({ $unwind: '$user' });

        if (conditionType) {
            pipeline.push({
                $match: {
                    'event.conditionParams.type': conditionType,
                },
            });
        }

        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $skip: pageParam * limitSize });
        pipeline.push({ $limit: limitSize });
        pipeline.push({
            $project: {
                _id: 1,
                status: 1,
                reason: 1,
                createdAt: 1,
                userId: 1,
                'user.nickname': 1,
                'event._id': 1,
                'event.title': 1,
                'event.conditionParams': 1,
            },
        });
        return this.rewardRequestsModel.aggregate(pipeline).exec();
    }
}
