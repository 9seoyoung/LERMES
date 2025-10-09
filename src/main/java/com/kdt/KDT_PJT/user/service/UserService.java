package com.kdt.KDT_PJT.user.service;

import com.kdt.KDT_PJT.cohortmem.repository.CohortMemberRepository;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import com.kdt.KDT_PJT.user.Dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("userUserService")
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private CohortMemberRepository cohortMemberRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            user.setEnabled(updatedUser.isEnabled());
            user.setRoleType(updatedUser.getRoleType());
            user.setUserTelno(updatedUser.getUserTelno());
            user.setCompanySn(updatedUser.getCompanySn());
            user.setCohortSn(updatedUser.getCohortSn());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<UserDto> findUsersByCompanyCohortAndRole(Long ogdpCoSn, Long ogdpCohortSn, Long userAuthrtSn) {
        List<CohortMember> members = cohortMemberRepository
                .findByCohortSnAndUserCompanySnAndUserRoleType(ogdpCohortSn, ogdpCoSn, userAuthrtSn);

        return members.stream()
                .map(cm -> UserDto.fromEntity(cm.getUser()))
                .collect(Collectors.toList());
    }

    // 회사 + 권한
    public List<UserDto> findUsersByCompanyAndRole(Long ogdpCoSn, Long userAuthrtSn) {
        List<User> users = userRepository.findByCompanySnAndRoleType(ogdpCoSn, userAuthrtSn);
        return users.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
    }


